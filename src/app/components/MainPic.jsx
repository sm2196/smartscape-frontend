import React from "react";
import { Parallax } from "react-scroll-parallax"; // Import Parallax
import "../App.css";
import "./MainPic.css";
import JoinUs from "./pages/joinus";

function MainPicSection() {
  return (
    <Parallax speed={-10}> {/* Apply the parallax effect */}
      <div className="SMMainPic-container">
        <h1>YOUR HOME AT YOUR FINGERTIPS</h1>
        <JoinUs />
      </div>
    </Parallax>
  );
}

export default MainPicSection;
