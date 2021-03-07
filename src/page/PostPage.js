import React, { useState } from 'react';

function PostPage({match}) {
  const [post, setPost] = useState();
  const filename = `${match.params.id}.md`;
  const data = require(`static/post/${filename}`);

  fetch(data.default).then(it => it.text()).then(it => setPost(it));

  return (
    <div>
      <div>post page</div>
      <div>${post}</div>
    </div>
  )
}

export default PostPage;