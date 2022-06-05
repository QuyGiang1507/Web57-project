import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import request from '../../api/request';
import Header from '../../components/Header/Header';
import './CreatePost.css';

function CreatePost () {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            description: "",
            song: "",
        },
    });

    const [ disabled, setDisabled ] = useState(true);

    const navigate = useNavigate();

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
    }

    const onChangeFile = async e => {
        const files = e.target.files;
        if (files.length) {
            const videoUrl = await uploadFile(files[0]);
            setValue('videoUrl', videoUrl);
            videoUrl ? setDisabled(false) : setDisabled(true);
        }
    };

    const onSubmit = async values => {
        console.log(values);
        if (values.videoUrl) {
            try {
                const res = await request({
                    url: '/api/posts',
                    method: 'POST',
                    data: {
                        videoUrl: values.videoUrl.data,
                        song: values.song || "Original audio",
                        description: values.description
                    }
                })
                if (res.data.success) {
                    window.location.href = "/"
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="create-post">
            <Header />
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="create-post__container"
            >
                <p className="create-post__title">Upload Video</p>
                <div className="create-post__form">
                    <div>
                        <label className="create-post__label">Description</label>
                        <textarea 
                            type="text" 
                            className="create-post__input create-post__description" 
                            rows="2"
                            {...register('description', { required: true })}
                        ></textarea>
                        {errors?.description?.type === 'required' && <p>Description is required</p>}
                    </div>
                    <div>
                        <label className="create-post__label">Song</label>
                        <input 
                            type="text" 
                            className="create-post__input"
                            {...register('song')}
                        />
                    </div>
                    <div>
                        <label className="create-post__label">Choose Video</label>
                        <input 
                            className="create-post__input" 
                            type="file" accept="video" 
                            id="video"
                            onChange={onChangeFile}
                        />
                    </div>
                    <button
                        type="submit" 
                        className="btn btn-post"
                        disabled={disabled}
                    >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost