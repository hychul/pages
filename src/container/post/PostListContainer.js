import React from 'react';
import { connect } from 'react-redux';
import PostList from 'component/post/PostList';
import { loadPosts } from 'redux/reducer/post';

function PostListContainer(props) {
  props.loadPosts();
  
  const page = props.page ?? 1;
  const tag = props.tag ?? 'all';
  const postList = props.state.map.get(tag) ?? [];

  return (
    <PostList page={page} tag={tag} postList={postList} />
  );
}

const mapStateToProps = state => ({
  state: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostListContainer);
