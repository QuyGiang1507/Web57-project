import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Video from "../../components/Video/Video";
import Header from '../../components/Header/Header';
import request from '../../api/request';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Home.css'

const MAX_LENGTH = 3;

function Home () {
    const [postData, setPostData] = useState({
        status: 'idle',
        data: [],
    });
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const nextPageUrl = useMemo(() => {
        if (skip >= 0) {
            return `${process.env.REACT_APP_BASE_PATH}/api/posts/?limit=${MAX_LENGTH}&skip=${skip}`
        };
        return null;
    }, [skip])

    console.log(process.env.REACT_APP_BASE_PATH)

    const fetchPosts = useCallback(async () => {
        try {
            setPostData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await request.get(nextPageUrl)
            if (res.data.success) {
                setPostData((preState) => ({
                    ...preState,
                    status: 'success',
                    data: res.data.data.reaction
                }))
                setSkip(skip + MAX_LENGTH);
            } else {
                setSkip(-1);
                setHasMore(false);
                setPostData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setSkip(-1);
            setHasMore(false);
            setPostData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }, []);

    const fetchMorePosts = async () => {
        try {
            const res = await request.get(nextPageUrl)
            if (res.data.success) {
                const total = res.data.data.total;
                if (skip + MAX_LENGTH > total) {
                    setSkip(-1);
                    setHasMore(false);
                } else {
                    setSkip(skip + MAX_LENGTH)
                }
                setPostData((preState) => ({
                    ...preState,
                    status: 'success',
                    data: [...preState.data, ...res.data.data.reaction]
                }))
            } else {
                setSkip(-1);
                setHasMore(false);
                setPostData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setSkip(-1);
            setHasMore(false);
            setPostData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
    }

    const handleUpdatePost = async (postId, data) => {
        try {
            const res = await request({
                url: `/api/posts/${postId}`,
                method: "PUT",
                data: data,
            })
            if (res.data.success) {
                const newPostData = postData.data.map((post) => {
                    return post._id === res.data.data._id ? res.data.data : post;
                })

                setPostData(() => ({
                    status: "success",
                    data: newPostData,
                }))
            }
        } catch (err) {
            alert(err.response.message);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const res = await request({
                url: `/api/posts/${postId}`,
                method: 'DELETE',
            })

            if (res.data.success) {
                const newPostData = postData.data.filter((post) => {
                    return post._id !== res.data.data._id;
                });
        
                setPostData(() => ({
                    status: "success",
                    data: newPostData,
                }))
            }
        } catch (err) {
            alert(err.response.message);
        }
    };

    useEffect(() => {
        fetchPosts()
    }, []);

    console.log(skip, hasMore, postData);

    return (
        <div className="main">
            <Header />
            <div className="video__container">
                <InfiniteScroll
                    dataLength={skip + MAX_LENGTH}
                    next={fetchMorePosts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    {postData.data.map((post) => (
                        <Video 
                            key={post._id}
                            postId={post._id}
                            url={post.videoUrl}
                            channel={post.createdBy.username}
                            description={post.description}
                            song={post.song}
                            likes={post.likeCount}
                            isliked={post.isliked}
                            handleUpdatePost={handleUpdatePost}
                            handleDeletePost={handleDeletePost}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Home