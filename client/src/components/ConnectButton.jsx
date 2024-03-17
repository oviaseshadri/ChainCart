
import { useEffect, useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { AiFillPlayCircle } from "react-icons/ai";

export default function ConnectButton() {
    const { connectWallet, currentAccount } = useContext(TransactionContext);
    const [ hideConnectBtn, setHideButtonBtn] = useState(false);

    useEffect(() => {
        if(window.ethereum && window.ethereum.isMiniPay) {
          connectWallet();
          setHideButtonBtn(true);
        }  else {
          setHideButtonBtn(false);
        }
    }, []);


    if(hideConnectBtn) return <span className="w-full flex flex-row justify-center items-center text-white">
      {currentAccount}
      </span>;

    if(!hideConnectBtn)  return <div className="w-full flex flex-row justify-center items-center">
        <button
          type="button"
          onClick={() => { connectWallet(); setHideButtonBtn(true) }}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          <AiFillPlayCircle className="text-white mr-2" />
          <p className="text-white text-base font-semibold">
            Connect Wallet
          </p>
        </button>
        </div>;

      if(hideConnectBtn || currentAccount) return <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
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
</div>;

      
}