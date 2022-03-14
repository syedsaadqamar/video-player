import "./App.css";
import "./index.css";
import React, { useRef, useReducer, useEffect } from "react";
import { FaPlay, FaStop, FaPause } from "react-icons/fa";
import test from "./music.mp4";

const videoLink = test;

export default function App() {
  return (
    <div className="App">
      <Video />
    </div>
  );
}

const VIDEO_STATE = {
  STOPPED: "STOPPED",
  PLAYED: "PLAYED",
  PAUSED: "PAUSED",
};

function Video() {
  const videoRef = useRef();
  const [{ videoState, currentTime }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "TOGGLE_PLAY_STATE": {
          const videoState =
            state.videoState === VIDEO_STATE.PLAYED
              ? VIDEO_STATE.PAUSED
              : VIDEO_STATE.PLAYED;
          return {
            ...state,
            videoState,
          };
        }
        case "STOP_VIDEO": {
          return {
            ...state,
            videoState: VIDEO_STATE.STOPPED,
            currentTime: 0,
          };
        }
        case "UPDATE_TIME": {
          return {
            ...state,
            currentTime: action.currentTime,
          };
        }
        default: {
          throw Error();
        }
      }
    },
    {
      videoState: VIDEO_STATE.STOPPED,
      currentTime: 0,
    }
  );

  let prograssValue = 0;
  if (videoRef.current && videoRef.current.duration) {
    console.log(videoRef.current.duration);
    prograssValue = (currentTime / videoRef.current.duration) * 100;
  }

  /**
   * actions
   */
  function toggleVideoStatus() {
    dispatch({ type: "TOGGLE_PLAY_STATE" });
  }

  function stopVideo() {
    dispatch({ type: "STOP_VIDEO" });
  }

  function updateTime() {
    dispatch({
      type: "UPDATE_TIME",
      currentTime: videoRef.current.currentTime,
    });
  }

  function setTime(e) {
    dispatch({
      type: "UPDATE_TIME",
      currentTime: (e.target.value * videoRef.current.duration) / 100,
    });
  }

  /**
   * effects
   */
  useEffect(() => {
    if (videoState === VIDEO_STATE.PLAYED) {
      videoRef.current.play();
    } else if (videoState === VIDEO_STATE.PAUSED) {
      videoRef.current.pause();
    } else if (videoState === VIDEO_STATE.STOPPED) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [videoState]);

  useEffect(() => {
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentTime === videoRef.current.duration) {
      dispatch({ type: "STOP_VIDEO" });
    }
  }, [currentTime]);

  return (
      <div className="Video-wrapper">
    <div className="container">
        <video
          ref={videoRef}
          src={videoLink}
          className="video"
          onClick={toggleVideoStatus}
          onTimeUpdate={updateTime}
        />
        <div className="Video-controls">
          <button className="Video-button" onClick={toggleVideoStatus}>
            {videoState === VIDEO_STATE.PLAYED ? (
              <FaPause className="Video-button-icon Video-button-icon-pause" />
            ) : (
              <FaPlay className="Video-button-icon Video-button-icon-play" />
            )}
          </button>
          <button className="Video-button" onClick={stopVideo}>
            <FaStop className="Video-button-icon Video-button-icon-stop" />
          </button>
          <input
            type="range"
            className="Video-prograss"
            min={0}
            max={100}
            step={0.1}
            value={prograssValue}
            onChange={setTime}
          />
          <Time currentTime={currentTime} />
        </div>
      </div>
    </div>
  );
}

function Time({ currentTime }) {
  let mins = Math.floor(currentTime / 60);
  if (mins < 10) {
    mins = `0${mins}`;
  }

  let secs = Math.floor(currentTime % 60);
  if (secs < 10) {
    secs = `0${secs}`;
  }

  return (
    <span className="Video-timestamp">
      {mins}:{secs}
    </span>
  );
}
