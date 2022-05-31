import React, { useState, useEffect } from 'react';
import "./VideoSidebar.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Comment from '../Comment/Comment';
import request from '../../api/request';
import isAuth from '../../hooks/useAuth';

function VideoSideBar({ likes, postId, isliked }) {
  const [linked, setLinked] = useState(isliked);
  const [likeCount, setLikeCount] = useState(likes);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isAuthenticated } = isAuth();

  const [comments, setComments] = useState({
    status: 'idle',
    data: {
      data: [],
      total: 0,
    },
  })

  const getCommentsByPost = async() => {
    try {
      const res = await request.get(`/api/posts/${postId}/comments`)
      if (res.data.success) {
        setComments({
          status: 'success',
          data: {
            data: res.data.data.data,
            total: res.data.data.total,
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const likePost = async () => {
    try {
      if (isAuthenticated) {
        setLinked(true);
        setLikeCount(likeCount + 1);
        const res = await request.put(`/api/posts/${postId}/like`);
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const dislikePost = async () => {
    try {
      if (isAuthenticated) {
        setLinked(false);
        setLikeCount(likeCount - 1);
        const res = await request.put(`/api/posts/${postId}/dislike`);
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCommentsByPost()
  }, [setComments]);

  return (
    <div className="videoSidebar">
      <div className="videoSidebar__option">
        <MoreVertIcon
          className="videoSidebar__more"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Update Post</MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </div>
      <div className="videoSidebar__button">
        {linked ? (
          <FavoriteIcon fontSize="large" onClick={dislikePost} />
        ) : (
          <FavoriteBorderIcon 
            fontSize="large" 
            onClick={likePost}
          />        
        )}
        <p>{likeCount}</p>
      </div>

      <div className="videoSidebar__button">
        <Comment comments={comments} postId={postId} getCommentsByPost={getCommentsByPost}/>
        <p>{comments.data.total}</p>
      </div>
    </div>
  );
}

export default VideoSideBar