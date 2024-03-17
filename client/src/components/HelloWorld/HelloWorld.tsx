import React from "react";
import "../../cvr"; // import side effects. The license, engineResourcePath, so on.
import VideoCapture from "../VideoCapture/VideoCapture";
import ImageCapture from "../ImageCapture/ImageCapture";
import "./HelloWorld.css";

class HelloWorld extends React.Component {
  state = {
    bShowVideoCapture: true,
    bShowImageCapture: false,
  };

  showVideoCapture = () => {
    this.setState({
      bShowVideoCapture: true,
      bShowImageCapture: false,
    });
  };

  stopVideoCapture = () => {
    this.setState({
      bShowVideoCapture: false,
      bShowImageCapture: false,
    });
  };

  // showImageCapture = () => {
  //   this.setState({
  //     bShowVideoCapture: false,
  //     bShowImageCapture: true,
  //   });
  // };

  render() {
    return (
      <div className="div-hello-world px-9">
        <div>
          <button
            className="p-5 bg-violet-700  text-white font-bold py-2 px-4 rounded-full"
            style={{
              marginRight: "10px",
              backgroundColor: this.state.bShowVideoCapture
                ? "#602ADA"
                : "white",
            }}
            onClick={this.showVideoCapture}
          >
            Scan Barcode
          </button>
          <button
            className="p-5 bg-violet-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={this.stopVideoCapture}
          >
            Close Camera
          </button>
        </div>
        <div className="container mt-5">
          {this.state.bShowVideoCapture ? <VideoCapture></VideoCapture> : ""}
        </div>
      </div>
    );
  }
}

export default HelloWorld;
