import React, { useState, useEffect } from 'react';
import Markdown from 'component/Markdown/Markdown';
import 'static/style/App.css';

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
      alignItems: 'center',
      width: 'calc(100% - 33px * 2)',
      padding: '33px',
    }}>
      {/* <div className="Panel">
        Title
      </div> */}
      <div className="Panel">
        <Markdown source={source}/>
      </div>
    </div>
  );
}

export default PostPage;
