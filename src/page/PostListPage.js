import React, { useEffect, useState } from 'react';

function PostListPage() {
  const pagingSize = 2;
  const [pageList, setPageList] = useState();
  const [pagingNum, setPagingNum] = useState(1);

  useEffect(() => {
    const data = require(`static/post/post.meta`);
    fetch(data.default).then(it => it.text()).then(it => {
      let pageList = it.split('\n');

      pageList = pageList.map((it) => <div key={it}>{it}</div>);

      // let ret = getPagingList(pageList, 1, pagingSize);

      setPageList(pageList);
    });
  }, []);

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
        {pageList}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        {pagingNum} 2 3 4 5 6 7 8
      </div>
    </div>
  )
}

function getPagingList(pageList, pagingNum, pagingSize) {
  let ret = [];

  for (let i = (pagingNum - 1) * pagingSize; i < pagingNum * pagingSize && i < pageList.length; i++) {
    ret.push(pageList[i]);
  }

  return ret;
}

export default PostListPage;
