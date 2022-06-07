import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MessageIcon from '@mui/icons-material/Message';
import { useForm } from "react-hook-form";
import axios from '../../api/request';
import isAuth from '../../hooks/useAuth';
import './Comment.css';

function Comment({ comments, postId, getCommentsByPost }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { isAuthenticated } = isAuth();

    const { 
        register, 
        handleSubmit,
        resetField,  
        formState: { errors } } = useForm(
            {
                defaultValues: {
                    content: '',
                },
            },
        );

    const onSubmitCreateComment = async (values) => {
        if (isAuthenticated) {
            const { content } = values;
            try {
                const res = await axios({
                    url: '/api/comments',
                    method: 'POST',
                    data: {
                        postId,
                        content,
                    }
                })
                if (res.data.success) {
                    resetField('content');
                    getCommentsByPost();
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("You need login to comment");
        }
    }

    return(
        <div>
            <MessageIcon 
                fontSize="large" onClick={handleOpen}
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="comment-box">
                    <form 
                        className="comment-form"
                        onSubmit={handleSubmit(onSubmitCreateComment)}
                    >
                        <input 
                            className="comment-input" 
                            type="text"
                            {...register('content')}
                        />
                        <button type="submit" className="comment-btn">Send</button>
                    </form>
                    <div className="comment-content">

                        {comments.data.data.map((comment) => (
                            <div key={comment._id}>
                                {comment.createdBy.username}: {comment.content}
                            </div>
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Comment