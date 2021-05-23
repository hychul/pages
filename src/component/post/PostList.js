import React, { useEffect, useState } from 'react';
import IndexSelector from 'component/IndexSelector';
import 'static/style/App.scss';
import PostListColumn from './PostListElement';

const pagingSize = 10;

function PostList(props) {
  const page = props.page;
  const tag = props.tag;
  const history = props.history;
  const postList = props.postList;

  const [viewList, setViewList] = useState([]);
  
  const getViewList = (postList, page, pagingSize) => {
    let ret = [];
  
    for (let i = (page - 1) * pagingSize; i < page * pagingSize && i < postList.length; i++) {
      let post = postList[i];
      ret.push(<PostListColumn key={post.title} post={post} />);
    }

    return ret;
  };

  useEffect(() => {
    setViewList(getViewList(postList, page, pagingSize));
  }, [page, postList]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '2em',
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
              search: `?page=${index}&tag=${tag}`
            });
          }}
        />
      </div>
    </div>
  );
}

export default PostList;
