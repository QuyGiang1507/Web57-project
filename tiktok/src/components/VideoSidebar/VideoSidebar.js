import React, { useState } from 'react';
import "./VideoSidebar.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function VideoSideBar({ likes, messages }) {
  const [linked, setLinked] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <FavoriteIcon fontSize="large" onClick={(e) => setLinked(false)} />
        ) : (
          <FavoriteBorderIcon 
            fontSize="large" 
            onClick={(e) => setLinked(true)}
          />        
        )}
        <p>{linked ? likes + 1 : likes}</p>
      </div>

      <div className="videoSidebar__button">
        <MessageIcon fontSize="large" />
        <p>{messages}</p>
      </div>
    </div>
  );
}

export default VideoSideBar