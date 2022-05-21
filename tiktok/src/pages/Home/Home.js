import React, { useState, useEffect, useCallback } from 'react';
import Video from "../../components/Video/Video";
import Header from '../../components/Header/Header';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import './Home.css'

const MAX_LENGTH = 3;

function MainPage () {
    const [postData, setPostData] = useState({
        state: 'idle',
        data: null,
    })

    const [ activeData, setActiveData ] = useState ({
        skip: 1,
        limit: MAX_LENGTH,
    })

    const [ more, setMore ] = useState(true);

    const fetchPosts = useCallback(async () => {
        try {
            setPostData((preState) => ({
                ...preState,
                status: "loading",
            }));
            const res = await axios.get(`http://localhost:9000/api/posts/?limit=${activeData.limit}&skip=${activeData.skip}`)
            if (res.data.success) {
                setPostData({
                    status: "success",
                    data: {
                        posts: res.data.data.enhanceReactionPosts,
                        total: res.data.data.totalPosts,
                    },
                });
            } else {
                setPostData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setPostData((preState) => ({
            ...preState,
            status: "error",
            }));
        }
    }, [activeData]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts])

    function fetchMorePosts() {
        setActiveData((preState) => ({
            ...preState,
            skip: preState.skip + 1,
            limit: MAX_LENGTH * preState.skip,
        }))
    }

    return (
        <div className="main">
            <Header />
            <div className="video__container">
                <InfiniteScroll
                    dataLength={MAX_LENGTH}
                    next={fetchMorePosts}
                    hasMore={more}
                    loader={<h4>Loading...</h4>}
                >
                    {postData.data.posts.map((post) => (
                        <Video 
                            key={post._id}
                            url={post.url}
                            channel={post.createdBy}
                            description={post.description}
                            song={post.song}
                            likes={post.likeCount}
                            messages={post.commentCount}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default MainPage