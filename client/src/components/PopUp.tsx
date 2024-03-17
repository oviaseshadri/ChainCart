import React, { useState } from "react";

const PopupComponent: React.FC = () => {
  // State to control the visibility of the popup
  const [isVisible, setIsVisible] = useState(false);

  // Function to show the popup
  const showPopup = () => setIsVisible(true);

  // Function to hide the popup
  const hidePopup = () => setIsVisible(false);

  return (
    <div>
      <button className="text-black" onClick={showPopup}>
        Show Popup
      </button>
      {isVisible && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "black",
            color: "white",
            padding: "20px",
            paddingBottom: "60px",
            paddingTop: "60px",
            zIndex: 1000,
            borderRadius: "15px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>This item is free 🎉🎉</p>
          {/* <button onClick={hidePopup}>Close</button> */}
        </div>
      )}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={hidePopup}
        ></div>
      )}
    </div>
  );
};

export default PopupComponent;
