import React from 'react';
import { Link } from 'react-router-dom';
import 'static/style/App.scss';

function PostListColumn(props) {
  const filename = props.post.filename;
  const title = props.post.title;
  const date = props.post.date;
  const tags = props.post.tags;

  return (
    <Link 
      key={filename}
      to={{pathname: `/posts/${filename}`}} 
      className="Panel"
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '2.5em 1.2em',
        alignItems: 'center',
        width: 'calc(100% - 1em * 2)',
        maxWidth: 'calc(1280px - 1em * 2)',
        margin: '0',
        padding: '0.5em 1em',
        textDecoration: 'none',
        color: '#242A2D',
      }}
    >
      <div style={{
        gridColumn: '1/3',
        gridRow: '1',
        fontWeight: 'bold',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: 'calc(0.75em + 1vmin)',
      }}>
        {title}
      </div>
      <div style={{
        gridColumn: '1',
        gridRow: '2',
        fontSize: '0.75em',
        color: '#6A737D',
      }}>
        {date}
        </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gridColumn: '2',
        gridRow: '2',
        gap: '4px',
        fontSize: '0.75em',
      }}>
        <div style={{backgroundColor: tags?.length > 0 ? '#DFE2E5' : 'white', padding: '2px 4px',}}>{tags}</div>
      </div>
    </Link>
  )
}

export default PostListColumn;
