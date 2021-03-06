import React, { useRef, useState, useEffect } from "react";
import "./Video.css";
import VideoFooter from "../VideoFooter/VideoFooter";
import VideoSidebar from "../VideoSidebar/VideoSidebar";

function Video({ url, channel, description, song, likes, postId, isliked, handleUpdatePost, handleDeletePost }) {
    const [playing, setPlaying] = useState(false);
    const [ muted, setMuted] = useState(false);
    const videoRef = useRef(null); 

    const onPlay = () => {
        videoRef.current.play();
        setPlaying(true);
    }

    const onPause = () => {
        videoRef.current.pause();
        setPlaying(false);
    }

    const onMuted = () => {
        setMuted(true);
    }

    const onUnmuted = () => {
        setMuted(false);
    }

    useEffect(() => {
        const options = {
            rootMargin: "0px",
            threshold: 1.0,
        };
    
        const handlePlay = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onPlay();
            } else {
                onPause();
            }
          });
        };
    
        const observer = new IntersectionObserver(handlePlay, options);
    
        observer.observe(videoRef.current);
    }, []);

    const handleVideoPress = () => {
        if (playing) {
            onPause();
        } else {
            onPlay();
        }
    }

    return (
        <div className="video">
            <video
                onClick={handleVideoPress}
                className="video__player"
                loop
                ref={videoRef}
                src={url}
                muted={muted}
            ></video>

            <VideoFooter channel={channel} description={description} song={song}/>
            <VideoSidebar 
                channel={channel} 
                likes={likes} 
                postId={postId} 
                isliked={isliked} 
                handleUpdatePost={handleUpdatePost} 
                handleDeletePost={handleDeletePost}
                muted={muted}
                onMuted={onMuted}
                onUnmuted={onUnmuted}
            />
        </div>
    )
}

export default Video;