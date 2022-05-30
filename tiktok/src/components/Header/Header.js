import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import './Header.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AuthRender = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <PersonIcon 
                className="header__user"
                style={{width: 'auto'}}
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

function Header() {
    const { isAuthenticated } = useAuth();

    return(
        <div className="header">
            <a href="/" className="header__home">
                <p>Home</p>
            </a>
            <div className="header__menu">
                <Link to="/posts/create">
                    <CloudUploadIcon className="header__upload" style={{width: 'auto'}}/>
                </Link>
                {isAuthenticated ? AuthRender() : <Link to="/auth" className="header__login">Login</Link>}
            </div>
        </div>
    )
}

export default Header