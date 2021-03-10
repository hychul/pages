import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PostListPage() {
  const pagingSize = 3;
  const [pagingNum, setPagingNum] = useState(1);
  const [totalList, setTotalList] = useState([]);
  const [viewList, setViewList] = useState([]);
  
  const loadPageList = useCallback(() => {
    const data = require(`static/post/post.meta`);
    fetch(data.default).then(it => it.text()).then(it => {
      it.split('\n')
        .forEach((it) => totalList.push(it));

      setViewList(getViewList(totalList, 1, pagingSize));
      setTotalList(() => totalList);
    });
  }, [totalList]);
  
  const getViewList = (totalList, pagingNum, pagingSize) => {
    let ret = [];
  
    for (let i = (pagingNum - 1) * pagingSize; i < pagingNum * pagingSize && i < totalList.length; i++) {
      ret.push(totalList[i]);
    }

    return ret.map((it) => (
      <Link 
        key={it}
        to={`/posts/${it}`} 
        style={{
          textDecoration: 'none',
          color: 'red'
        }}
      >
        {it}
      </Link>
    ));
  };
  
  useEffect(() => {
    loadPageList();
  }, [loadPageList]);

  useEffect(() => {
    setViewList(getViewList(totalList, pagingNum, pagingSize));
  }, [totalList, pagingNum]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      rowGap: '15px',
      justifyContent: 'center',
      width: '100%',
      padding: '32px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        POST LIST
      </div>
      <div style={{
        display: 'grid',
        justifyContent: 'center',
      }}>
        {viewList}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        {pagingNum} 2 3 4 5 6 7 8
      </div>
      <button onClick={() => {
        setPagingNum(() => pagingNum + 1);
      }}>
        increase
      </button>
    </div>
  )
}

export default PostListPage;
