// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool); // Added function
}

contract ChainCart {
    struct Item {
        string name;
        string brand;
        uint256 price;
        uint256 quantity;
        uint256 luckyQuantity; // Number of lucky units for this item
    }

    struct CartItem {
        uint256 itemId;
        uint256 quantity; 
        uint256 numLucky;
    }

    // Struct to hold cart item information
    struct CartItemInfo {
        uint256 itemId;
        string name;
        string brand;
        uint256 price;
        uint256 quantity; // Cart quantity
        uint256 numLucky;
    }


    mapping(uint256 => Item) public items;
    mapping(uint256 => uint256[]) private luckyItemIds; // Item ID => IDs of lucky items
    mapping(string => address[]) public brandAdmins;
    mapping(address => CartItem[]) public userCarts; // User address => Cart

    address public owner;
    address public tokenAddress; // Address of the ERC20 token contract

    event PaymentReceived(address indexed user, uint256 totalPrice);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier onlyBrandAdmin(string memory _brand) {
        require(isBrandAdmin(msg.sender, _brand), "Only brand admins can call this function");
        _;
    }

    function isBrandAdmin(address _admin, string memory _brand) private view returns (bool) {
        for (uint256 i = 0; i < brandAdmins[_brand].length; i++) {
            if (brandAdmins[_brand][i] == _admin) {
                return true;
            }
        }
        return false;
    }

    // Function to set the ERC20 token address
    function setTokenAddress(address _tokenAddress) external onlyOwner {
        tokenAddress = _tokenAddress;
    }

    // Function to add a batch of items by the contract owner
    function addItemsByOwner(uint256[] memory _itemIds, string[] memory _brands, string[] memory _names, uint256[] memory _prices, uint256[] memory _quantities) external onlyOwner {
        require(_itemIds.length == _brands.length && _itemIds.length == _names.length && _itemIds.length == _prices.length && _itemIds.length == _quantities.length, "Invalid batch");

        for (uint256 i = 0; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            string memory itemBrand = _brands[i];
            items[itemId] = Item(_names[i], itemBrand, _prices[i], _quantities[i], 0);

            // Check if the brand is encountered for the first time
            if (brandAdmins[itemBrand].length == 0) {
                // Initialize the brand with an empty array of admins
                brandAdmins[itemBrand];
            }
        }
    }

    // Function to remove a batch of items by the contract owner
    function removeItemsByOwner(uint256[] memory _itemIds) external onlyOwner {
        for (uint256 i = 0; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            require(itemId < type(uint256).max, "Invalid item ID");
            delete items[itemId];
        }
    }

    // Function for a brand admin to set lucky items for an item
    // have to check if the admin is setting lucky id for his own brand item only
    function setLuckyItems(uint256 _itemId, uint256[] memory _luckyItemIds) external onlyBrandAdmin(items[_itemId].brand) {
        luckyItemIds[_itemId] = _luckyItemIds;
    }

    // Function to add an item to the user's cart
    function addItemToCart(uint256 _itemId) external {
        require(items[_itemId].quantity > 0, "Item is out of stock");

        CartItem[] storage cart = userCarts[msg.sender];

        // Check if the item is already present in the cart
        for (uint256 i = 0; i < cart.length; i++) {
            if (cart[i].itemId == _itemId) {
                cart[i].quantity++;
                items[_itemId].quantity--; // Reduce the quantity of the item in inventory

                // Check if the remaining quantity matches any lucky item IDs
                if (items[_itemId].luckyQuantity > 0) {
                    for (uint256 j = 0; j < luckyItemIds[_itemId].length; j++) {
                        if (items[_itemId].luckyQuantity == luckyItemIds[_itemId][j]) {
                            cart[i].numLucky++;
                            items[_itemId].luckyQuantity--; // Reduce the lucky quantity of the item
                            break;
                        }
                    }
                }
                return; // Exit the function
            }
        }

        // If the item is not in the cart, add it with quantity 1
        uint256 remainingQuantity = items[_itemId].quantity;
        uint256[] storage luckyItemIdsbyBrand = luckyItemIds[_itemId];
        uint256 numLucky = 0;

        for (uint256 i = 0; i < luckyItemIdsbyBrand.length; i++) {
            if (remainingQuantity == luckyItemIdsbyBrand[i]) {
                numLucky++;
                remainingQuantity--;
                items[_itemId].luckyQuantity--; // Reduce the lucky quantity of the item
            }
        }

        cart.push(CartItem(_itemId, 1, numLucky));
        items[_itemId].quantity--; // Reduce the quantity of the item in inventory
    }


    // Function to remove an item from the user's cart
    // benefit of doubt to brand, if the user removes item his luck goes away
    function removeItemFromCart(uint256 _itemId, address _user) external {
        CartItem[] storage cart = userCarts[_user];

        // Find the item in the cart
        for (uint256 i = 0; i < cart.length; i++) {
            if (cart[i].itemId == _itemId) {
                require(cart[i].quantity > 0, "Item quantity in cart is already zero");

                // Decrease the quantity of the item in the cart
                cart[i].quantity--;

                // Increase the quantity of the item in inventory
                items[_itemId].quantity++;

                // Check if the item had any lucky quantities
                if (cart[i].numLucky > 0) {
                    cart[i].numLucky--;
                    // Increase lucky quantity in inventory
                    items[_itemId].luckyQuantity++;
                }
                
                return; // Exit the function after removing one item
            }
        }
    }

    // Function to calculate the total price of a user's cart
    function calculateTotalPrice(address _user) external view returns (uint256 totalPrice) {
        CartItem[] storage cart = userCarts[_user];
        for (uint256 i = 0; i < cart.length; i++) {
            uint256 itemId = cart[i].itemId;
            totalPrice += items[itemId].price * cart[i].quantity;
            totalPrice -= items[itemId].price * cart[i].numLucky;
        }
    }

    // Function to accept payment in ERC20 tokens
    function acceptPayment(address _user) external {
        uint256 totalPrice = 0;
        CartItem[] storage cart = userCarts[_user];
        for (uint256 i = 0; i < cart.length; i++) {
            uint256 itemId = cart[i].itemId;
            totalPrice += items[itemId].price * cart[i].quantity;
            totalPrice -= items[itemId].price * cart[i].numLucky;
        }
        require(totalPrice > 0, "Cart is empty");
        uint256 finalPrice = totalPrice / 10000;

        IERC20 token = IERC20(tokenAddress);
        uint256 allowance = token.allowance(_user, address(this));

        if (allowance < finalPrice) {
            // Approve the contract to spend the required amount
            require(token.approve(address(this), finalPrice), "Approval failed");
        }

        // Transfer tokens from the user to the contract
        require(token.transferFrom(_user, address(this), finalPrice), "Transfer failed");
        this.emptyCart(_user);
        emit PaymentReceived(_user, finalPrice);
    }

    // Function to withdraw ERC20 tokens from the contract
    function withdrawTokens(address payable _recipient, uint256 _amount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(_recipient, _amount), "Transfer failed");
    }



    // Function to withdraw ETH from the contract
    function withdrawEther(address payable _recipient, uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        _recipient.transfer(_amount);
    }

    // // Function to add a new brand by the contract owner
    // function addBrand(string memory _brand) external onlyOwner {
    //     require(brandAdmins[_brand].length == 0, "Brand already exists");
    //     // Initialize the brand with an empty array of brand admins
    //     brandAdmins[_brand];
    // }

    // Function to add a brand admin by the contract owner
    function addBrandAdmin(string memory _brand, address _admin) external onlyOwner {
        // require(brandAdmins[_brand].length > 0, "Brand does not exist");
        // Check if the brand is encountered for the first time
        if (brandAdmins[_brand].length == 0) {
            // Initialize the brand with an empty array of admins
            brandAdmins[_brand];
        }
        brandAdmins[_brand].push(_admin);
    }

    // Function to remove a brand admin by the contract owner
    function removeBrandAdmin(string memory _brand, address _admin) external onlyOwner {
        require(brandAdmins[_brand].length > 0, "Brand does not exist");
        for (uint256 i = 0; i < brandAdmins[_brand].length; i++) {
            if (brandAdmins[_brand][i] == _admin) {
                brandAdmins[_brand][i] = brandAdmins[_brand][brandAdmins[_brand].length - 1];
                brandAdmins[_brand].pop();
                break;
            }
        }
    }

    function getUserCart(address _user) external view returns (CartItemInfo[] memory) {
        CartItem[] storage cart = userCarts[_user];
        CartItemInfo[] memory userCartInfo = new CartItemInfo[](cart.length);

        for (uint256 i = 0; i < cart.length; i++) {
            uint256 itemId = cart[i].itemId;
            userCartInfo[i].itemId = itemId;
            userCartInfo[i].quantity = cart[i].quantity;
            userCartInfo[i].numLucky = cart[i].numLucky;

            // Fetch item details from the items mapping
            userCartInfo[i].name = items[itemId].name;
            userCartInfo[i].brand = items[itemId].brand;
            userCartInfo[i].price = items[itemId].price;
        }

        return userCartInfo;
    }

    function emptyCart(address _user) external {
        CartItem[] storage cart = userCarts[_user];

        for (uint256 i = 0; i < cart.length; i++) {
            this.removeItemFromCart(cart[i].itemId,_user);
        }

        // After removing all items, delete the user's cart
        delete userCarts[_user];
    }
}

