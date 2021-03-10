import React, { useCallback, useEffect, useState } from 'react';

function PostListPage() {
  const pagingSize = 3;
  const [pageList, setPageList] = useState([]);
  const [pagingNum, setPagingNum] = useState(1);
  const [curList, setCurList] = useState([]);

  const loadPageList = useCallback(() => {
    const data = require(`static/post/post.meta`);
    fetch(data.default).then(it => it.text()).then(it => {
      it.split('\n').map((it) => <div key={it}>{it}</div>).forEach((it) => pageList.push(it));

      setCurList(getCurList(pageList, 1, pagingSize));
      setPageList(() => pageList);
    });
  }, [pageList]);
  
  const getCurList = (pageList, pagingNum, pagingSize) => {
    let ret = [];
  
    for (let i = (pagingNum - 1) * pagingSize; i < pagingNum * pagingSize && i < pageList.length; i++) {
      ret.push(pageList[i]);
    }
  
    return ret;
  }
    
  useEffect(() => {
    loadPageList();
  }, [loadPageList]);

  useEffect(() => {
    setCurList(getCurList(pageList, pagingNum, pagingSize));
  }, [pageList, pagingNum]);

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
        {curList}
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
