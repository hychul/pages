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
      <div className="Panel">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '10px',
          width: '100%',
          maxWidth: '1010px',
        }}>
          <div style={{
            fontWeight: '700',
            fontSize: '23px',
          }}>
            {location.post.title}
          </div>
          <div style={{
            color: '#6A737D',
          }}>
            {location.post.date}
          </div>
        </div>
      </div>
      <div className="Panel">
        <Markdown source={source}/>
      </div>
    </div>
  );
}

export default PostPage;
