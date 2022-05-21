import React, { useState, useEffect, useCallback } from 'react';
import Video from "../../components/Video/Video";
import Header from '../../components/Header/Header';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import './Home.css'

const MAX_LENGTH = 3;

function Home () {
    const [postData, setPostData] = useState({
        state: 'idle',
        data: [],
    })

    const [ activeData, setActiveData ] = useState ({
        skip: 1,
        limit: MAX_LENGTH,
    })

    const fetchPosts = useCallback(async () => {
        try {
            setPostData((preState) => ({
                ...preState,
                status: "loading",
            }));
            const res = await axios.get(`http://localhost:9000/api/posts/?limit=${activeData.limit}&skip=${activeData.skip}`)
            
            console.log(res)
            if (res.data.success) {
                setPostData((preState) => ({
                    ...preState,
                    status: "success",
                    data:  res.data.data.reaction,
                }));
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

    
    // const loadFunc = async () => {
    //     setActiveData((preState) => ({
    //         ...preState,
    //         skip: preState.skip + 1,
    //     }))
    // }

    return (
        <div className="main">
            <Header />
            <div className="video__container">
                {/*<InfiniteScroll
                    pageStart={0}
                    loadMore={loadFunc}
                    hasMore={true || false}
                    useWindow={false}
                    loader={
                    <div key="loading" className="loader">
                        Loading ...
                    </div>
                    }
                >
                    {postData.data.map((post) => (
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
                </InfiniteScroll>*/}
                {console.log(postData.data)}
                {postData.data.map((post) => (
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
            </div>
        </div>
    )
}

export default Home