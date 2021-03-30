const LOAD_POST_LIST = 'LOAD_POST_LIST';

const initialState = {
  isLoad: false,
  posts: []
}

export const loadPostList = () => (dispatch, getState) => {
  const state = getState().posts;

  if (state.isLoad) {
    return;
  }

  const data = require(`static/post/post.meta`);

  fetch(data.default).then(it => it.text()).then(it => {
    const list = [];
    it.split('\n')
      .filter((it) => !it.startsWith('//'))
      .map((it) => it.split(' :: '))
      .filter((it) => it.length >= 3)
      .map((it) => ({
        filename: it[0],
        date: it[1],
        title: it[2],
        tags: Array.from(new Set(it[3]?.split(', ').filter((it) => it != "")))
      }))
      .forEach((it) => list.push(it));

    dispatch({
      type: LOAD_POST_LIST,
      list: list
    });
  });
}

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_POST_LIST:
      return {
        isLoad: true,
        posts: action.list
      }
    default:
      return state;
  }
}

export default postListReducer;
