import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function PostPage({match}) {
  const [post, setPost] = useState();

  const filename = `${match.params.id}.md`;

  try {
    const data = require(`static/post/${filename}`);
    fetch(data.default).then(it => it.text()).then(it => setPost(it));
  } catch (e) {
    setPost("The file you are looking for does not exist.");
  }

  return (
    <div style={{
      padding:'30px',
      paddingTop:'10px',
      paddingBottom:'10px',
      backgroundColor:'white',
      fontFamily: 'Helvetica, arial, sans-serif',
      lineHeight:'1.6',
      fontSize:'14px',
      color:'#242A2D'
    }}>
      <ReactMarkdown 
        plugins={[[gfm, {singleTilde: false}]]} 
        source={post} 
        escapeHtml={false} 
        renderers={markdownRenderers} 
      />
    </div>
  );
}

const markdownRenderers = {
  code: (props) => { //F6F8FA
    return (
        <SyntaxHighlighter 
          language={props.language} 
          // showLineNumbers
          style={githubGist} 
          customStyle={{
            backgroundColor:'#F6F8FA',
            borderRadius:'4px',
            padding:'16px',
            lineHeight:'1.5',
            fontSize:'0.85em'
          }}
          children={props.value}
        />
    );
  },
  inlineCode: (props) => {
    return (
      <code style={{
        backgroundColor: '#F6F8FA',
        padding:'4px',
        fontSize:'12px'
      }}>
        {props.value}
      </code>
    );
  },
  tableCell: tableCell,
  blockquote: (props) => {
    return (
      <div style={{
        borderLeft:'solid 3px #DFE2E5',
        paddingLeft:'14px',
        color:'#6A737D'
      }}>
        {props.children}
      </div>
    );
  }
}

function tableCell(props) {
  let style = {
    textAlign: props.align ? props.align : 'center',
    padding: '0.5rem'
  }

  if (props.isHeader) {
    style.fontWeight = 'bold';
  }

  style.border = '1px solid #DFE2E5';

  return (
    <td style={style}>
      {props.children}
    </td>
  );
}

export default PostPage;
