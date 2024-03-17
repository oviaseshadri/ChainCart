import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const Services = () => (
  <div className="flex w-full justify-center items-center gradient-bg-services">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-center">
        <h1 className="text-white text-center text-3xl sm:text-5xl py-2 ">
          Services that we
          <br />
          continue to improve
        </h1>
        <p className="text-center my-2 text-white font-light md:w-9/12 w-full text-base">
          The best choice for the fastest shopping experience, powered by web3.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Security gurantee"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="Security is guranteed. You will be anonymous!"
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Faster Checkout"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="We want to reduce the number of times you have to sign"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Pay cheaper gas in stables"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="We will build on all L2s. MiniPay enbled gas in stables!"
        />
      </div>
    </div>
  </div>
);

export default Services;
