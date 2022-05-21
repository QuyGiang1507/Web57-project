import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

function Pagination() {
    const [ more, setMore ] = useState(true);

    return(
        <InfiniteScroll
            pageStart={0}
            loadMore={loadFunc}
            hasMore={more}
            loader={<div className="loader" key={0}>Loading ...</div>}
        >
            {items}
        </InfiniteScroll>
    )
}

export default Pagination;