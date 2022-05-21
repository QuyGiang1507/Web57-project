import React from 'react';
import Header from '../../components/Header/Header';
import './CreatePost.css';

function CreatePost () {
    return (
        <div className="create-post">
            <Header />
            <div className="create-post__container">
                <p className="create-post__title">Upload Video</p>
                <div className="create-post__content">
                    <div className="create-post__uploader">        
                        <div className="create-post__upload">
                            <p>Input your video to upload</p>
                            <button className="btn">
                                <label>Choose Video
                                    <input type="file" accept="video" id="video" style={{display: "none"}} className="create-post__upload-video"/>
                                </label>
                            </button>
                        </div>
                    </div>
                    <div className="create-post__form">
                        <div>
                            <label className="create-post__label">Description</label>
                            <textarea  className="create-post__input create-post__description" rows="2"></textarea>
                        </div>
                        <div>
                            <label className="create-post__label">Song</label>
                            <input  className="create-post__input"/>
                        </div>
                        <button className="btn btn-post">Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost