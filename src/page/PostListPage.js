import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useHistoryState from 'component/Util/UseHistoryState';

function PostListPage() {
  const pagingSize = 10;
  const [pagingNum, setPagingNum] = useHistoryState('pagingNum', 1);
  const [totalList, setTotalList] = useState({isLoaded: false, list: []});
  const [viewList, setViewList] = useState([]);
  
  const loadTotalList = useCallback(() => {
    if (totalList.isLoaded) {
      return;
    }

    console.log('load');
    const list = [];
    const data = require(`static/post.meta`);
    fetch(data.default).then(it => it.text()).then(it => {
      it.split('\n')
        .map((it) => it.split(' :: '))
        .filter((it) => it.length >= 3)
        .map((it) => ({
          filename: it[0],
          date: it[1],
          title: it[2],
          tags: it[3]?.split(', ')
        }))
        .forEach((it) => list.push(it));

      setViewList(getViewList(list, pagingNum, pagingSize));
      setTotalList((it) => {
        it.isLoaded = true;
        it.list = list;
        return it;  
      });
    });
  }, [totalList, pagingNum]);
  
  const getViewList = (totalList, pagingNum, pagingSize) => {
    let ret = [];
  
    for (let i = (pagingNum - 1) * pagingSize; i < pagingNum * pagingSize && i < totalList.length; i++) {
      ret.push(totalList[i]);
    }

    return ret.map((it) => (
      <Link 
        key={it.filename}
        to={`/posts/${it.filename}`} 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '2.5em 1.2em',
          alignItems: 'center',
          width: 'calc(100% - 1em)',
          margin: '0',
          marginTop: '-1px',
          border: 'solid 1px #DFE2E5',
          padding: '0.5em',
          textDecoration: 'none',
          color: '#242A2D',
        }}
      >
        <div style={{
          gridColumn: '1/3',
          gridRow: '1',
          fontSize: '1.5em',
          fontWeight: 'bold',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {it.title}
        </div>
        <div style={{
          gridColumn: '1',
          gridRow: '2',
          fontSize: '0.75em'
        }}>
          {it.date}
          </div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gridColumn: '2',
          gridRow: '2',
          fontSize: '0.75em',
        }}>
          <div style={{backgroundColor: it.tags?.length > 0 ? '#DFE2E5' : 'white', padding: '2px 4px',}}>{it.tags}</div>
        </div>
      </Link>
    ));
  };
  
  useEffect(() => {
    loadTotalList();
  }, [loadTotalList]);

  useEffect(() => {
    setViewList(getViewList(totalList.list, pagingNum, pagingSize));
  }, [totalList, pagingNum]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '15px',
      alignItems: 'center',
      width: 'calc(100% - 33px * 2)',
      padding: '33px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1280px',
        padding: '0px',
      }}>
        {viewList}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        <button onClick={() => {
          setPagingNum(() => pagingNum - 1);
        }}>
          prev
        </button>
        <div style={{margin: '0 10px 0 10px'}}>{pagingNum}</div>
        <button onClick={() => {
          setPagingNum(() => pagingNum + 1);
        }}>
          next
        </button>
      </div>
    </div>
  )
}

export default PostListPage;
