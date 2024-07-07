import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../../Components/Comments/Comments";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
// import vid from "../../Components/Video/vid.mp4";
import LikeWatchLaterSaveBtns from "./LikeWatchLaterSaveBtns";
import "./VideoPage.css";
import { addToHistory } from "../../actions/History";
import { viewVideo } from "../../actions/video";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

function VideoPage() {
  const { vid } = useParams();
  const buttonRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isTheatre, setIsTheatre] = useState(false);
  const [miniPlayer, setMiniPlayer] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSettModalOpen, setIsSettModalOpen] = useState(false);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const vids = useSelector((state) => state.videoReducer);
  // console.log(vids)
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  useEffect(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: buttonRect.top - buttonRect.height - 10, // Adjust the vertical positioning
        left: buttonRect.left
      });
    }
  }, [isSettModalOpen]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (CurrentUser) {
      handleHistory();
    }
    handleViews();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleHistory = () => {
    dispatch(
      addToHistory({
        videoId: vid,
        Viewer: CurrentUser?.result._id,
      })
    );
  };

  const handleViews = () => {
    dispatch(viewVideo({
      id: vid
    }))
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleTheatre = () => {
    setIsTheatre(!isTheatre)
  };

  const className = !isPlaying
    ? (isTheatre ? 'vidcontainer2 paused' : 'vidcontainer1 paused')
    : (isTheatre ? 'vidcontainer2' : 'vidcontainer1');

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent default space bar scrolling behavior
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(isPlaying);
        } else {
          videoRef.current.pause();
          setIsPlaying(!isPlaying);
        }
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) { // Firefox
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { // IE/Edge
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleEnterPiP = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.requestPictureInPicture();
      } catch (error) {
        console.error('Failed to enter Picture-in-Picture mode:', error);
      }
    }
  };

  const handleExitPiP = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch((error) => {
        console.error('Failed to exit Picture-in-Picture mode:', error);
      });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const getVolumeIcon = () => {
    if (volume == 0) {
      return faVolumeMute;
    } else if (volume > 0 && volume <= 0.5) {
      return faVolumeDown;
    } else {
      return faVolumeUp;
    }
  };

  const handleVolumeClick = () => {
    setVolume(!volume);
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleSettModal = () => {
    setIsSettModalOpen(!isSettModalOpen);
  };

  const toggleSpeedModal = () => {
    setIsSettModalOpen(false);
    setIsSpeedModalOpen(!isSpeedModalOpen);
  }

  const toggleB2SettModal1 = () => {
    setIsSpeedModalOpen(false);
    setIsSettModalOpen(true);
  }

  const toggleB2SettModal2 = () => {
    setIsQualityModalOpen(false);
    setIsSettModalOpen(true);
  }

  const toggleQualityModal = () => {
    setIsSettModalOpen(false);
    setIsQualityModalOpen(!isQualityModalOpen);
  }

  return (
    <>
      <div className="container_videoPage">
        <div className={!isTheatre ? "container2_videoPage1" : "container2_videoPage2"}>
          <div className="video_display_screen_videoPage">
            {/* <div className={!isPlaying ? "vidcontainer paused" : "vidcontainer"}> */}
            <div className={className}>
              <div className="vidcontrolscontainer">
                <div className="timelinecontainer">
                  <div className="controls">
                    <button className="play-pause-btn" onClick={togglePlayPause}>
                      {isPlaying ?
                        (<svg className="pause-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                        </svg>) :
                        (<svg className="play-icon" viewBox="0 0 24 24" >
                          <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>)
                      }
                    </button>
                    <div className="volume-control">
                      <FontAwesomeIcon icon={getVolumeIcon()} size="lg" style={{ paddingRight: "5px" }} onClick={handleVolumeClick} />
                      <input
                        id="volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                      />
                    </div>
                    <div className="durationContainer">
                      <div className="currentTime">{formatTime(currentTime)}</div>
                      /
                      <div className="totalTime">{formatTime(duration)}</div>
                    </div>
                    <div className="settingsContainer">
                      <button className="settingsbtn" style={{ marginTop: 4 }} onClick={toggleSettModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M24 13.616v-3.232c-1.651-.587-2.693-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.749-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.743-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 3.384c-2.762 0-5-2.239-5-5s2.238-5 5-5 5 2.239 5 5-2.238 5-5 5zm3-5c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3z" /></svg>
                      </button>

                      {isSettModalOpen && (
                        <div className="modal-overlay" onClick={toggleSettModal}>
                          <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{ top: modalPosition.top, left: modalPosition.left }}
                          >
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>Subtitles/CC</span>
                              <span style={{ textAlign: "right", fontWeight: "bold" }}>&gt;</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSpeedModal}>
                              <span style={{ textAlign: "left" }}>Playback speed</span>
                              <span style={{ textAlign: "right", fontWeight: "bold" }}>&gt;</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleQualityModal}>
                              <span style={{ textAlign: "left" }}>Quality</span>
                              <span style={{ textAlign: "right", fontWeight: "bold" }}>&gt;</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {isSpeedModalOpen && (
                        <div className="speedmodal-overlay" onClick={toggleSpeedModal}>
                          <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{ top: modalPosition.top, left: modalPosition.left }}
                          >
                            <p className="close-modal-button" onClick={toggleB2SettModal1}>
                              <span style={{ textAlign: "left" }}>&lt;</span>
                              <span style={{ textAlign: "left", fontWeight: "bold" }}>Playback speed</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>0.25</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>0.5</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>0.75</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>Normal</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>1.25</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>1.5</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>1.75</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>2</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {isQualityModalOpen && (
                        <div className="qualitymodal-overlay" onClick={toggleQualityModal}>
                          <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{ top: modalPosition.top, left: modalPosition.left }}
                          >
                            <p className="close-modal-button" onClick={toggleB2SettModal2}>
                              <span style={{ textAlign: "left" }}>&lt;</span>
                              <span style={{ textAlign: "left", fontWeight: "bold" }}>Quality</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>720p</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>480p</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>360p</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>240p</span>
                            </p>
                            <p className="close-modal-button" onClick={toggleSettModal}>
                              <span style={{ textAlign: "left" }}>144p</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="miniplayerbtn" onClick={handleEnterPiP}>
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" />
                      </svg>
                    </button>
                    <button class="theater-btn" onClick={toggleTheatre}>
                      {!isTheatre ?
                        (<svg class="tall" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                        </svg>) :
                        (<svg class="wide" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z" />
                        </svg>)
                      }
                    </button>
                    <button className="fullscreenbtn" onClick={handleFullscreen}>
                      <svg class="open" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                      {/* <svg class="close" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                      </svg> */}
                    </button>
                  </div>
                </div>
              </div>
              <video
                src={`http://localhost:5500/${vv?.filePath}`}
                // src={`https://movpics.onrender.com/${vv?.filePath}`}
                className={"video_ShowVideo_videoPage"}
                ref={videoRef}
                autoPlay
                onClick={togglePlayPause}
              // autoPlay
              ></video>
            </div>
            <div className="video_details_videoPage">
              <div className="video_btns_title_VideoPage_cont">
                <p className="video_title_VideoPage"> {vv?.videoTitle}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.Views} views <div className="dot"></div>{" "}
                    {moment(vv?.createdAt).fromNow()}
                  </div>
                  <LikeWatchLaterSaveBtns vv={vv} vid={vid} />
                </div>
              </div>
              <Link
                to={`/chanel/${vv?.videoChanel}`}
                className="chanel_details_videoPage"
              >
                <b className="chanel_logo_videoPage">
                  <p>{vv?.Uploder.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv?.Uploder}</p>
              </Link>
              <div className="comments_VideoPage">
                <h2>
                  <u>Coments</u>
                </h2>
                <Comments videoId={vv._id} />
              </div>
            </div>
          </div>
          {/* <div className="moreVideoBar">More video</div> */}
        </div>
      </div>
    </>
  );
}

export default VideoPage;
