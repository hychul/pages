import React, { useState, useEffect } from 'react';
import 'static/style/App.scss';
import { connect } from 'react-redux';
import { loadPostList } from 'redux/reducer/postList';
import Post from 'component/post/Post';

function PostPage(props) {
  const match = props.match;
  const postId = match.params.id;

  const postList = props.post.posts;

  // TODO: Remove
  const location = props.location;

  const [source, setSource] = useState();
  const [meta, setMeta] = useState({});

  useEffect(() => {
    try {
      const data = require(`static/post/${postId}.md`);
      fetch(data.default).then(it => it.text()).then(it => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [postId]);

  return (
    <Post title={location.post.title} date={location.post.date} source={source} />
  );
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
)(PostPage);
