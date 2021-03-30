import React from 'react';
import Markdown from 'component/markdown/Markdown';
import 'static/style/App.scss';

function Post(props) {
  const title = props.title;
  const date = props.date;
  const source = props.source;

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
        gridTemplateColumns: '1fr 96px',
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
          {title}
        </div>
        <div style={{
          textAlign: 'end',
          color: '#6A737D'
        }}>
          {date}
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
  )
}

export default Post;
