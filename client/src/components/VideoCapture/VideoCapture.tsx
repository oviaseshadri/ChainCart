import React, { useContext } from "react";
import { createWalletClient, custom, getContract } from 'viem'

import { celoAlfajores } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import { EnumCapturedResultItemType } from "dynamsoft-core";
import { DecodedBarcodesResult } from "dynamsoft-barcode-reader";
import {
  CameraEnhancer,
  CameraView,
} from "dynamsoft-camera-enhancer";
import {
  CapturedResultReceiver,
  CaptureVisionRouter,
} from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import "../../cvr"; // import side effects. The license, engineResourcePath, so on.
import "./VideoCapture.css";
import {providers, Contract} from "ethers"
import { contractABI, contractAddress } from "../../utils/constants";
declare var window: any

const {ethereum} = window;

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const createEthereumContract = () => {

  const provider = new providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  signer.getAddress().then(address => console.log(address));

  console.log(contractAddress, contractABI, signer);
  const transactionsContract = new Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

class VideoCapture extends React.Component {
  pInit: Promise<{
    cameraView: CameraView;
    cameraEnhancer: CameraEnhancer;
    router: CaptureVisionRouter;
  }> | null = null;
  pDestroy: Promise<void> | null = null;

  uiContainer: React.RefObject<HTMLDivElement> = React.createRef();
  resultsContainer: React.RefObject<HTMLDivElement> = React.createRef();
  cartContainer: React.RefObject<HTMLDivElement> = React.createRef();

  async init(): Promise<{
    cameraView: CameraView;
    cameraEnhancer: CameraEnhancer;
    router: CaptureVisionRouter;
  }> {
    try {
      // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
      const cameraView = await CameraView.createInstance();
      const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
      this.uiContainer.current!.innerText = "";
      this.uiContainer.current!.append(cameraView.getUIElement()); // Get default UI and append it to DOM.

      // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
      const router = await CaptureVisionRouter.createInstance();
      router.setInput(cameraEnhancer);

      // Define a callback for results.
      const resultReceiver = new CapturedResultReceiver();
      resultReceiver.onDecodedBarcodesReceived = (
        result: DecodedBarcodesResult
      ) => {
        if (!result.barcodeResultItems.length) return;

        this.resultsContainer.current!.textContent = '';
        console.log(result);
        for (let item of result.barcodeResultItems) {
          this.resultsContainer.current!.append(
            `${item.formatString}: ${item.text}`,
            document.createElement('br'),
            document.createElement('hr'),
          );
        }
      };
      router.addResultReceiver(resultReceiver);

      // Filter out unchecked and duplicate results.
      const filter = new MultiFrameResultCrossFilter();
      filter.enableResultCrossVerification(
        EnumCapturedResultItemType.CRIT_BARCODE,
        true
      ); // Filter out unchecked barcodes.
      // Filter out duplicate barcodes within 3 seconds.
      filter.enableResultDeduplication(
        EnumCapturedResultItemType.CRIT_BARCODE,
        true
      );
      filter.setDuplicateForgetTime(
        EnumCapturedResultItemType.CRIT_BARCODE,
        3000
      );
      await router.addResultFilter(filter);

      // Open camera and start scanning single barcode.
      await cameraEnhancer.open();
      await router.startCapturing("ReadSingleBarcode");
      return {
        cameraView,
        cameraEnhancer,
        router,
      };
    } catch (ex: any) {
      let errMsg = ex.message || ex;
      console.error(errMsg);
      alert(errMsg);
      throw ex;
    }
  }

  async destroy(): Promise<void> {
    if (this.pInit) {
      const { cameraView, cameraEnhancer, router } = await this.pInit;
      router.dispose();
      cameraEnhancer.dispose();
      cameraView.dispose();
    }
  }

  async componentDidMount() {
    // In 'development', React runs setup and cleanup one extra time before the actual setup in Strict Mode.
    if (this.pDestroy) {
      await this.pDestroy;
      this.pInit = this.init();
    } else {
      this.pInit = this.init();
    }

    // Code here runs after every page load
    const data = this.displayCart();

    this.cartContainer.current!.textContent = '';
    console.log(data);
    this.cartContainer.current!.textContent = data;
    
  }

  async componentWillUnmount() {
    await (this.pDestroy = this.destroy());
    console.log("VideoCapture Component Unmount");
  }

  shouldComponentUpdate() {
    // Never update UI after mount, sdk use native way to bind event, update will remove it.
    return false;
  }

  extractitemid = (str : string) => {
    // Remove all spaces and newline characters from the string
    const processedStr = str.replace(/\s/g, '');

    const parts = processedStr.split(':');
    console.log("parts: ", parts)
    if (parts.length === 2) {
        // if (!isNaN(parts[1])) {
            return Number(parts[1]);
        // }
    }
    return 0;
}

displayCart = async () => {
  console.log("going to display the cart")
  try {
    if (window.ethereum) {
      // const { addressTo, amount, keyword, message } = formData;
      // const transactionsContract = createEthereumContract();
      // // const parsedAmount = ethers.utils.parseEther(amount);
      // const tx = await transactionsContract.addItemToCart(itemid);
      // await tx.wait()
      const walletClient = createWalletClient({ 
        chain: celoAlfajores, 
        transport: custom(window.ethereum), 
      }) 
      const [address] = await walletClient.getAddresses();

      const data = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'getUserCart',
        args: [address]
      })

    // alert(data);
    console.log(data)

    return data;

    } else {
      console.error('Error getting cart details');
      
    }
  } catch (error) {
    console.log(error);
    alert(error);
    throw new Error("No ethereum object");
  }
}


  addItem = async () => {
    const resultsText = this.resultsContainer.current? this.resultsContainer.current.innerText : ":";
    // uint256 resultText = 5013665116417;
    console.log("rest text: ", resultsText)
    this.addItemToCart(this.extractitemid(resultsText))
    // this.addItemToCart(5013665116417)

  }

  addItemToCart = async (itemid: number) => {
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      if (window.ethereum) {
        // const { addressTo, amount, keyword, message } = formData;
        // const transactionsContract = createEthereumContract();
        // // const parsedAmount = ethers.utils.parseEther(amount);
        // const tx = await transactionsContract.addItemToCart(itemid);
        // await tx.wait()
        const walletClient = createWalletClient({ 
          chain: celoAlfajores, 
          transport: custom(window.ethereum), 
        }) 
        const [address] = await walletClient.getAddresses();

        const tx = await walletClient.writeContract({
          address: contractAddress,
          abi: contractABI,
          functionName: "addItemToCart",
          account: address,
          args: [itemid]
        });


        const receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
      });

      alert(receipt);

      return receipt;

      } else {
        console.error('Error adding item to cart:');
        
      }
    } catch (error) {
      console.log(error);
      alert(error);
      throw new Error("No ethereum object");
    }

  }

  render() {
    return (
      <div>
        <div ref={this.uiContainer} className="div-ui-container "></div>
        {/* Results: */}
        <br></br>
        <div ref={this.resultsContainer} className="div-results-container flex w-full justify-center items-center"></div>
        <button className="p-5 bg-violet-700 rounded-lg flex w-full justify-center items-center" onClick={this.addItem}>Add Item</button>
        <div ref={this.cartContainer} className="div-cart-container flex w-full justify-center items-center"></div>
      </div>
    );
  }
}

export default VideoCapture;
