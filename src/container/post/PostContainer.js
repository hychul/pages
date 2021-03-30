import React from 'react';
import { connect } from 'react-redux';
import Post from 'component/post/Post';

function PostContainer(props) {
  const postId = props.postId
  const postList = props.post.posts;

  const [source, setSource] = useState();
  const [meta, setMeta] = useState({title: "", date: ""});


  useEffect(() => {
    if (postList.length < 1) {
      props.loadPosts();
    } else {
      postList.array.forEach(element => {
        if (element.filename == postId) {
          setMeta({
            title: element.title,
            date: element.date
          })
        }
      });
    }
  }, [props, postList.length])

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
  post: state.posts
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPostList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostContainer)