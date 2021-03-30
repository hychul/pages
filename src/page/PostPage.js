import React from 'react';
import PostContainer from 'container/post/PostContainer';

function PostPage(props) {
  const postId = props.match.params.id;
  const history = props.history;

  return (
    <PostContainer postId={postId} history={history} />
  );
}

export default PostPage;
