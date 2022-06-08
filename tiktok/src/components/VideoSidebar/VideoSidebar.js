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
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';

function VideoSideBar({ channel, likes, postId, isliked, handleUpdatePost, handleDeletePost }) {
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
  const [openUpdateModal, setopenUpdateModal] = useState(false);

  const { isAuthenticated, user } = isAuth();

  const handleOpenUpdateModal = () => {
    if (isAuthenticated) {
      if (channel === user.username) {
        setopenUpdateModal(true);
      } else {
        alert("This post is not yours");
      }
    } else {
      alert("You need to update the post");
    }
  };
  const handleCloseUpdateModal = () => setopenUpdateModal(false);

  const [ disabled, setDisabled ] = useState(true);

  const [comments, setComments] = useState({
    status: 'idle',
    data: {
      data: [],
      total: 0,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await request({
            url: '/api/upload',
            method: 'POST',
            data: formData,
        });
        return res.data;
    } catch (err) {
        return '';
    }
  };

  const onChangeFile = async e => {
    const files = e.target.files;
    if (files.length) {
        const videoUrl = await uploadFile(files[0]);
        setValue('videoUrl', videoUrl);
        videoUrl ? setDisabled(false) : setDisabled(true);
    }
  };

  const handleUpdateData = async values => {
      const updateData = {};
  
      if (values.videoUrl) {
        updateData.videoUrl = values.videoUrl.data;
      }
  
      if (values.description) {
        updateData.description = values.description;
      }
  
      if (values.song) {
        updateData.song = values.song;
      }
  
      await handleUpdatePost(postId, updateData);
      await handleCloseUpdateModal();
  }

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
      } else {
        alert("You need login to react the post");
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
      } else {
        alert("You need login to react the post");
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
          <div onClick={handleClose}>
            <MenuItem 
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
                handleOpenUpdateModal();
              }}>Update Post
            </MenuItem>
            <MenuItem onClick={(e) => handleDeletePost(postId)}>Delete</MenuItem>
          </div>
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

      <Modal
        open={openUpdateModal}
        onClose={(e) => {
          e.stopPropagation();
          handleCloseUpdateModal();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form 
          className="videoSideBar__update-container"
          onSubmit={
            handleSubmit(handleUpdateData)
          }
        >
          <p className="videoSideBar__title">Upload Video</p>
          <div className="videoSideBar__form">
              <div>
                  <label className="videoSideBar__label">Description</label>
                  <textarea 
                      type="text" 
                      className="videoSideBar__input videoSideBar__description" 
                      rows="2"
                      {...register('description')}
                  ></textarea>
              </div>
              <div>
                  <label className="videoSideBar__label">Song</label>
                  <input 
                      type="text" 
                      className="videoSideBar__input"
                      {...register('song')}
                  />
              </div>
              <div>
                  <label className="videoSideBar__label">Choose Video</label>
                  <input 
                      className="videoSideBar__input" 
                      type="file" accept="video" 
                      id="video"
                      onChange={onChangeFile}
                  />
              </div>
              <button type="submit" className="btn btn-post" disabled={disabled}>Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default VideoSideBar