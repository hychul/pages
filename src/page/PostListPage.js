import React from 'react';
import queryStirng from 'query-string';
import PostList from 'component/post/PostList';

function PostListPage({location, history}) {
  const query = queryStirng.parse(location.search);

  return(
    <PostList page={query.page} history={history} />
  )
}

export default PostListPage;
