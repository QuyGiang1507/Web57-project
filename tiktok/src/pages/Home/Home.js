import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Video from "../../components/Video/Video";
import Header from '../../components/Header/Header';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Home.css'

const MAX_LENGTH = 3;

function Home () {
    const [postData, setPostData] = useState({
        status: 'idle',
        data: [],
    })
    const [skip, setSkip] = useState(0);

    const nextPageUrl = useMemo(() => {
        if (skip >= 0) {
            return `http://localhost:9000/api/posts/?limit=${MAX_LENGTH}&skip=${skip}`
        };
        return null;
    }, [skip])

    const fetchPosts = useCallback(async () => {
        try {

            setPostData((preState) => ({
                ...preState,
                status: "loading",
            }));

            const res = await axios.get(nextPageUrl);

            if (res.data.success) {
                const total = res.data.data.total;
                if ((skip + 1) * MAX_LENGTH > Math.ceil(total / MAX_LENGTH)) {
                    setSkip(-1);
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
                setPostData((preState) => ({
                    ...preState,
                    status: "error",
                }));
            }
        } catch (err) {
            setSkip(-1);
            setPostData((preState) => ({
                ...preState,
                status: "error",
            }));
        }
        
    }, []);

    const hasMore = !!nextPageUrl;

    useEffect(() => {
        fetchPosts()
    }, []);

    console.log(postData);
    return (
        <div className="main">
            <Header />
            <div className="video__container">
                <InfiniteScroll
                    dataLength={MAX_LENGTH * (skip + 1)}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    {postData.data.map((post, index) => (
                        <Video 
                            key={index}
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