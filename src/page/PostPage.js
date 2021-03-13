import React, { useState, useEffect } from 'react';
import Markdown from 'component/Markdown/Markdown';

function PostPage({match}) {
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
      rowGap: '15px',
      alignItems: 'center',
      width: 'calc(100% - 33px * 2)',
      padding: '33px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: 'calc(100% - 33px * 2)',
        maxWidth: 'calc(1280px - 33px * 2)',
        margin: '0px',
        border: 'solid 1px #DDE0E4',
        borderRadius: '0.5em',
        padding: '14px 33px',
        backgroundColor: 'white',
        fontFamily: 'Helvetica, arial, sans-serif',
        lineHeight: '1.6',
        fontSmooth: 'auto',
        fontSize: '16px',
        color: '#242A2D',
      }}>
        <Markdown source={source}/>
      </div>
    </div>
  );
}

export default PostPage;
