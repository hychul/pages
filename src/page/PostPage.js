import React from 'react';
import Markdown from 'component/Markdown/Markdown';

function PostPage({match}) {
  const filename = `${match.params.id}.md`;

  return (
    <Markdown filename={filename}/>
  );
}

export default PostPage;
