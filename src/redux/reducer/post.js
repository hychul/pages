import { UPDATE_TAG } from "./tag";

const UPDATE_POST_LIST = 'UPDATE_POST_LIST';

const initialState = {
  isLoad: false,
  map: new Map()
}

export const loadPosts = () => (dispatch, getState) => {
  const state = getState().posts;

  if (state.isLoad) {
    return;
  }

  const data = require(`static/post/post.meta`);

  fetch(data.default)
    .then(it => it.text())
    .then(it => {
      const postMap = new Map();
      postMap.set('all', []);
      const tagMap = new Map();

      it.split('\n')
        .filter(it => !it.startsWith('//'))
        .map(it => it.split(' :: '))
        .filter(it => it.length >= 3)
        .map(it => ({
          filename: it[0],
          date: it[0].substring(0, 10),
          title: it[1],
          tags: Array.from(new Set(it[2]?.split(', ').filter(it => it != "")))
        }))
        .forEach(post => {
          post.tags
              .forEach(tag => {
                const list = postMap.get(tag) ?? [];
                list.push(post);
                postMap.set(tag, list);

                const count = tagMap.get(tag) ?? 0;
                tagMap.set(tag, count + 1);
              });
          
          postMap.get('all').push(post);
        });

      dispatch({
        type: UPDATE_TAG,
        map: tagMap
      })

      dispatch({
        type: UPDATE_POST_LIST,
        map: postMap
      });
    });
}

function postReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POST_LIST:
      return {
        isLoad: true,
        map: action.map
      }
    default:
      return state;
  }
}

export default postReducer;
