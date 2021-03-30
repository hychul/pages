import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PostList from 'component/post/PostList';
import { loadPostList } from 'redux/reducer/postList';

function PostListContainer(props) {
  const page = props.page;
  const history = props.history;
  const postList = props.post.posts;

  useEffect(() => {
    if (postList.length < 1) {
      props.loadPosts();
    }
  }, [props, postList.length])

  return (
    <PostList page={page ?? 1} history={history} postList={postList ?? []} />
  )
}

const mapStateToProps = state => ({
  post: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPostList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostListContainer);
