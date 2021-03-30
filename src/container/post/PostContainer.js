import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Post from 'component/post/Post';
import { loadPostList } from 'redux/reducer/postList';

function PostContainer(props) {
  props.loadPosts();

  const postId = props.postId
  const postList = props.state.posts;

  const [source, setSource] = useState();
  const [meta, setMeta] = useState({title: "", date: ""});

  useEffect(() => {
    postList.forEach(element => {
      if (element.filename == postId) {
        setMeta({
          title: element.title,
          date: element.date
        });
        return;
      }
    })
  }, [postList, postId])

  useEffect(() => {
    try {
      const data = require(`static/post/${postId}.md`);
      fetch(data.default).then(it => it.text()).then(it => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [postId]);

  return (
    <Post title={meta.title} date={meta.date} source={source} />
  )
}

const mapStateToProps = state => ({
  state: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPostList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostContainer);