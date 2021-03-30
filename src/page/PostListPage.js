import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import queryStirng from 'query-string';
import IndexSelector from 'component/IndexSelector';
import 'static/style/App.scss';

function PostListPage({location, history}) {
  const pagingSize = 10;

  const query = queryStirng.parse(location.search);

  const [pagingNum, setPagingNum] = useState(query.page === undefined ? 1 : query.page);
  const [totalList, setTotalList] = useState({size: 1, list: []}); // TODO: use redux
  const [viewList, setViewList] = useState([]);

  const loadTotalList = useCallback(() => {
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
        it.size = Math.ceil(list.length / pagingSize);
        it.list = list;
        return it;
      });
    });
  }, [setTotalList, pagingNum]);
  
  const getViewList = (totalList, pagingNum, pagingSize) => {
    let ret = [];
  
    for (let i = (pagingNum - 1) * pagingSize; i < pagingNum * pagingSize && i < totalList.length; i++) {
      ret.push(totalList[i]);
    }

    return ret.map((it) => (
      <Link 
        key={it.filename}
        to={{
          pathname: `/posts/${it.filename}`,
          post: {
            filename: it.filename,
            title: it.title,
            date: it.date,
            tags: it.tags,
          }
        }} 
        className="Panel"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '2.5em 1.2em',
          alignItems: 'center',
          width: 'calc(100% - 1em * 2)',
          maxWidth: 'calc(1280px - 1em * 2)',
          margin: '0',
          padding: '0.5em 1em',
          textDecoration: 'none',
          color: '#242A2D',
        }}
      >
        <div style={{
          gridColumn: '1/3',
          gridRow: '1',
          fontWeight: 'bold',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: 'calc(0.75em + 1vmin)',
        }}>
          {it.title}
        </div>
        <div style={{
          gridColumn: '1',
          gridRow: '2',
          fontSize: '0.75em',
          color: '#6A737D',
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
    setPagingNum(query.page === undefined ? 1 : query.page)
    setViewList(getViewList(totalList.list, query.page === undefined ? 1 : query.page, pagingSize));
  }, [totalList.list, query.page]);

  console.log(totalList)

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
        <IndexSelector
          currentIndex={pagingNum}
          maxIndex={totalList.size}
          onIndex={(index) =>{
            history.push({
              pathname: '/posts',
              search: `?page=${index}`
            });
          }}
        />
      </div>
    </div>
  )
}

export default PostListPage;
