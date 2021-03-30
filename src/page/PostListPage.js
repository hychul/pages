import React from 'react';
import queryStirng from 'query-string';
import PostListContainer from 'container/post/PostListContainer';

function PostListPage({location, history}) {
  const query = queryStirng.parse(location.search);

  return(
    <PostListContainer page={query.page} history={history} />
  )
}

export default PostListPage;
