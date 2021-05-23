import React from 'react';
import PostContainer from 'container/post/PostContainer';

function PostPage(props) {
  const postId = props.match.params.id;

  return (
    <PostContainer postId={postId} />
  );
}

export default PostPage;
