import React from 'react';
import { connect } from 'react-redux';
import PostList from 'component/post/PostList';
import { loadPostList } from 'redux/reducer/postList';

function PostListContainer(props) {
  props.loadPosts();
  
  const page = props.page;
  const history = props.history;
  const postList = props.state.posts;

  return (
    <PostList page={page ?? 1} history={history} postList={postList ?? []} />
  );
}

const mapStateToProps = state => ({
  state: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPostList())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostListContainer);
