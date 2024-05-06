import React, { useContext } from "react";

import { TransactionContext } from "../context/TransactionContext";
// import { shortenAddress } from "../utils/shortenAddress";
import ConnectButton from "./ConnectButton";

const Welcome = () => {
  useContext(TransactionContext);

  // const [ hideConnectBtn, setHideButtonBtn] = useState(true);

  // useEffect(() => {
  //   if(window.ethereum && window.ethereum.isMiniPay) {
  //     connectWallet();
  //   } else {
  //     setHideButtonBtn(false);
  //   }
  // }, []);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="w-full text-center text-3xl sm:text-5xl text-white py-1">
            Shopping just became <br /> a lot easier <br /> much faster <br />{" "}
            and more decentralised
          </h1>
          <p className="text-center mt-5 text-white font-light md:w-9/12 w-full text-base">
            {/* Worry about building, not about the people you build with! Form your dream team in one click. */}
          </p>
          {/* {!currentAccount && (
            <div className="w-full flex flex-row justify-center items-center">
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
            </div>
          )} */}

          {/* {currentAccount && (
        <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
        <div className="flex justify-between flex-col w-full h-full">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
              <SiEthereum fontSize={21} color="#fff" />
            </div>
            <BsInfoCircle fontSize={17} color="#fff" />
          </div>
          <div>
            <p className="text-white font-light text-sm">
              {shortenAddress(currentAccount)}
            </p>
            <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
          </div>
        </div>
      </div>
      )} */}

          <ConnectButton />
        </div>
        {/* <Form /> */}
      </div>
    </div>
  );
};

export default Welcome;
