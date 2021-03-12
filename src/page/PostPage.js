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
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '15px',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '33px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: 'calc(100% - 33px * 2)',
        maxWidth: '1215px',
        margin: '0px',
        border: 'solid 1px #DDE0E4',
        borderRadius: '0.5em',
        padding: '33px',
        paddingTop: '14px',
        paddingBottom: '14px',
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
