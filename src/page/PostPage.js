import React, { useState } from 'react';

function PostPage({match}) {
  const [post, setPost] = useState();

  const filename = `${match.params.id}.md`;

  try {
    const data = require(`static/post/${filename}`);
    fetch(data.default).then(it => it.text()).then(it => setPost(it));
  } catch (e) {
    setPost("The file you are looking for does not exist.");
  }

  return (
    <div>
      <div>post page</div>
      <div>${post}</div>
    </div>
  )
}

export default PostPage;