import "./App.css";
import "./index.css";
import React from "react";
import test from "./production.mov";

const videoLink = test;

export default function App() {
  return (
    <div className="Video-wrapper">
      <video
        autoPlay="autoplay"
        src={videoLink}
        muted 
        className="video"
        loop
        playsInline
        type='video/mp4'
      />
    </div>
  );
}

