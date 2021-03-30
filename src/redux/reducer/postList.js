import { LOAD_POST_LIST } from "redux/action";

const initialState = {
  posts: []
}

export const loadPostList = () => dispatch => {
  const data = require(`static/post.meta`);

  fetch(data.default).then(it => it.text()).then(it => {
    const list = [];
    it.split('\n')
      .map((it) => it.split(' :: '))
      .filter((it) => it.length >= 3)
      .map((it) => ({
        filename: it[0],
        date: it[1],
        title: it[2],
        tags: it[3]?.split(', ')
      }))
      .forEach((it) => list.push(it));

      dispatch({
        type: LOAD_POST_LIST,
        list: list
      })
  });
}

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_POST_LIST:
      return {
        posts: action.list
      }
    default:
      return state;
  }
}

export default postListReducer;
