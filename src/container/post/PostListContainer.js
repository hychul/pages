import React from 'react';
import { connect } from 'react-redux';
import PostList from 'component/post/PostList';
import { loadPosts } from 'redux/reducer/post';

function PostListContainer(props) {
  props.loadPosts();
  
  const category = props.category ?? 'all';
  const page = props.page ?? 1;
  const history = props.history;
  const postList = props.state.posts ?? [];

  console.log(category);

  return (
    <PostList category={category} page={page} postList={postList} history={history} />
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
