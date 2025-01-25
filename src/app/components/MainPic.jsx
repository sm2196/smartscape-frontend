import React from "react";
import "../App.css";
import "./MainPic.css";
import JoinUs from "./pages/joinus";

function MainPicSection() {
  return (
    <div className="SMMainPic-container">
      <h1>YOUR HOME AT YOUR FINGERTIPS</h1>
      {/* <p>What are you waiting for?</p> */}
      <JoinUs />
    </div>
  );
}

export default MainPicSection;
