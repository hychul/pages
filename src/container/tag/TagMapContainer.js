import TagMap from 'component/post/TagMap';
import React from 'react';
import { connect } from 'react-redux';
import { loadPosts } from 'redux/reducer/post';

function TagMapContainer(props) {
  props.loadPosts();

  const tagMap = props.state.map;

  return (
    <TagMap tagMap={tagMap} />
  );
}

const mapStateToProps = state => ({
  state: state.tags
});

const mapDispatchToProps = dispatch => ({
  loadPosts: () => dispatch(loadPosts())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagMapContainer);