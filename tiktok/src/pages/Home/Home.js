import React, { useState, useEffect, useCallback } from 'react';
import Video from "../../components/Video/Video";
import Header from '../../components/Header/Header';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import './Home.css'

const MAX_LENGTH = 3;

function Home () {
    const [postData, setPostData] = useState({
        status: 'idle',
        data: [],
    })

    const [ skip, setSkip ] = useState(1)

    const [ nextPageUrl, setNextPageUrl ] = useState(`http://localhost:9000/api/posts/?limit=${MAX_LENGTH}&skip=${skip}`)

    const fetchPosts = useCallback(async () => {
        try {
            setPostData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await axios.get(nextPageUrl);

            console.log(res);
            if (res.data.success) {
                setPostData({
                    status: "success",
                    data:  res.data.data.reaction,
                    total: res.data.data.total,
                });
            } else {
                setPostData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }

            if(MAX_LENGTH * skip < postData.data.total) {
                setSkip((preState) => ({
                    skip: preState + 1,
                }))
                setNextPageUrl(`http://localhost:9000/api/posts/?limit=${MAX_LENGTH}&skip=${skip}`)
            } else {
                setNextPageUrl(null)
            }

        } catch (err) {
            setPostData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
        
    }, [postData, nextPageUrl, skip]);

    const hasMore = !!nextPageUrl;

    return (
        <div className="main">
            <Header />
            <div className="video__container">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={fetchPosts}
                    hasMore={hasMore}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >
                    {postData.data.map((post) => (
                        <Video 
                            key={post._id}
                            url={post.videoUrl}
                            channel={post.createdBy.username}
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

export default Home