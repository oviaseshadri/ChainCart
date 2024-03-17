import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Form = () => {
  const {
    currentAccount, 
    connectWallet,
    handleChange,
    sendTransaction,
    formData,
    isLoading,
  } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message } = formData;

    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message) return;

    sendTransaction();
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
      

    


      <h1 className="text-3xl sm:text-5xl text-white py-1">
            Register you Profile
          </h1>
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <Input
          placeholder="Name"
          name="name"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Email"
          name="email"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Country"
          name="country"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="GitHub"
          name="github"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Twitter"
          name="twitter"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Experience"
          name="experience"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Tools you know"
          name="tools"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Platforms you have worked on"
          name="platforms"
          type="text"
          handleChange={handleChange}
        />
        {/* <Input
          placeholder="Amount (ETH)"
          name="amount"
          type="number"
          handleChange={handleChange}
        />
        <Input
          placeholder="Keyword (Gif)"
          name="keyword"
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Enter Message"
          name="message"
          type="text"
          handleChange={handleChange}
        /> */}

        <div className="h-[1px] w-full bg-gray-400 my-2" />

        {isLoading ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Send now
          </button>
        )}
      </div>
    </div>
  );
};

export default Form;
