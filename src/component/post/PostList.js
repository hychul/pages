import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IndexSelector from 'component/IndexSelector';
import 'static/style/App.scss';

const pagingSize = 10;

function PostList(props) {
  const page = props.page;
  const history = props.history;
  const postList = props.postList;

  const [viewList, setViewList] = useState([]);
  
  const getViewList = (postList, page, pagingSize) => {
    let ret = [];
  
    for (let i = (page - 1) * pagingSize; i < page * pagingSize && i < postList.length; i++) {
      ret.push(postList[i]);
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
    setViewList(getViewList(postList, page, pagingSize));
  }, [page, postList]);

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
          currentIndex={page}
          maxIndex={Math.ceil(postList.length / pagingSize)}
          onIndex={(index) =>{
            if (page == index) {
              return;
            }

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

export default PostList;
