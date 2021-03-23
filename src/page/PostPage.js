import React, { useState, useEffect } from 'react';
import Markdown from 'component/markdown/Markdown';
import 'static/style/App.scss';

function PostPage({match, location}) {
  const [source, setSource] = useState();

  useEffect(() => {
    try {
      const data = require(`static/post/${match.params.id}.md`);
      fetch(data.default).then(it => it.text()).then(it => setSource(it));
    } catch (e) {
      setSource("The file you are looking for does not exist.");
    }
  }, [match.params.id]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'calc(100% - 33px * 2)',
      padding: '33px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 90px',
        alignItems: 'end',
        marginBottom: '1em',
        width: '100%',
        maxWidth: '1010px',
        maxHeight: '120px',
        overflow: 'hidden',
        whiteSpace: 'normal',
        textOverflow: 'ellipsis',
      }}>
        <div style={{
          textAlign: 'start',
          fontWeight: '700',
          fontSize: '32px',
        }}>
          {location.post.title}
        </div>
        <div style={{
          textAlign: 'end'
        }}>
          {location.post.date}
        </div>
      </div>
      <div 
        id="body"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div className="Panel">
          <Markdown source={source}/>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
