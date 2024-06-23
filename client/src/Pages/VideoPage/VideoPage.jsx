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

function VideoPage() {
  const { vid } = useParams();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTheatre, setIsTheatre] = useState(false);
  const [miniPlayer, setMiniPlayer] = useState(false);

  const vids = useSelector((state) => state.videoReducer);
  // console.log(vids)
  const vv = vids?.data.filter((q) => q._id === vid)[0];
  const dispatch = useDispatch();
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

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
                    <button className="settingsbtn" style={{ marginTop: 4 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M24 13.616v-3.232c-1.651-.587-2.693-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.749-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.743-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 3.384c-2.762 0-5-2.239-5-5s2.238-5 5-5 5 2.239 5 5-2.238 5-5 5zm3-5c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3z" /></svg>
                    </button>
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
                // src={`http://localhost:5500/${vv?.filePath}`}
                src={`http://localhost:5500/${vv?.filePath}`}
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
