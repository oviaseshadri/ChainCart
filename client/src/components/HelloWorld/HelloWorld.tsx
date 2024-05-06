import React, { useContext, useState } from "react";
import "../../cvr"; // import side effects. The license, engineResourcePath, so on.
import VideoCapture from "../VideoCapture/VideoCapture";
import ImageCapture from "../ImageCapture/ImageCapture";
import "./HelloWorld.css";
import { TransactionContext } from "../../context/TransactionContext";

const HelloWorld = () => {
  const [bShowVideoCapture, setBShowVideoCapture] = useState(true);
  const [bShowImageCapture, setBShowImageCapture] = useState(false);

  const { currentAccount } = useContext(TransactionContext);

  const showVideoCapture = () => {
    setBShowVideoCapture(true);
    setBShowImageCapture(false);
  };

  const stopVideoCapture = () => {
    setBShowVideoCapture(false);
    setBShowImageCapture(false);
  };

  // const showImageCapture = () => {
  //   setBShowVideoCapture(false);
  //   setBShowImageCapture(true);
  // };

  return (
    currentAccount && (
      <div className="div-hello-world px-9">
        <div>
          <button
            className="p-5 bg-violet-700 text-white font-bold py-2 px-4 rounded-full"
            style={{
              marginRight: "10px",
              backgroundColor: bShowVideoCapture ? "#602ADA" : "white",
            }}
            onClick={showVideoCapture}
          >
            Scan Barcode
          </button>
          <button
            className="p-5 bg-violet-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={stopVideoCapture}
          >
            Close Camera
          </button>
        </div>
        <div className="container mt-5">
          {bShowVideoCapture ? <VideoCapture /> : ""}
        </div>
      </div>
    )
  );
};

export default HelloWorld;
