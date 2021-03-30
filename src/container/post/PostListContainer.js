import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PostList from 'component/post/PostList';
import { loadPostList } from 'redux/reducer/postList';

function PostListContainer(props) {
  const page = props.page;
  const history = props.history;
  const post = props.post;

  useEffect(() => {
    if (post.posts.length < 1) {
      props.loadPosts();
    }
  }, [props, post.posts.length])

  return (
    <PostList page={page ?? 1} history={history} postList={post?.posts ?? []} />
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
