import React from 'react';
import Markdown from 'component/Markdown/Markdown';

function PostPage({match}) {
  const filename = `${match.params.id}.md`;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: '#11D999',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1080px',
        backgroundColor: 'red',
      }}>
        <Markdown filename={filename}/>
      </div>
    </div>
  );
}

export default PostPage;
