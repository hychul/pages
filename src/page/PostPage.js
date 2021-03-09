import React from 'react';
import Markdown from 'component/Markdown/Markdown';

function PostPage({match}) {
  const filename = `${match.params.id}.md`;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      rowGap: '15px',
      justifyContent:'center',
      width:'100%',
      // maxWidth: '1080px',
      padding:'32px'
    }}>
      <div style={{
        display:'flex',
        justifyContent:'center',
        margin:'0px',
        border:'solid 1px #DDE0E4',
        borderRadius:'0.5em',
        padding:'32px',
        paddingTop:'12px',
        paddingBottom:'12px',
        backgroundColor:'white',
        fontFamily: 'Helvetica, arial, sans-serif',
        lineHeight:'1.6',
        fontSmooth:'auto',
        fontSize:'16px',
        color:'#242A2D',
      }}>
        <Markdown filename={filename}/>
      </div>
    </div>
  );
}

export default PostPage;
