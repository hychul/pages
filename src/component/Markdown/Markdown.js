import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function Markdown(props) {
  const [post, setPost] = useState();

  try {
    const data = require(`static/post/${props.filename}`);
    fetch(data.default).then(it => it.text()).then(it => setPost(it));
  } catch (e) {
    setPost("The file you are looking for does not exist.");
  }

  return (
    <div style={{
      width:'100%',
      padding:'30px',
      paddingTop:'10px',
      paddingBottom:'10px',
      backgroundColor:'white',
      fontFamily: 'Helvetica, arial, sans-serif',
      lineHeight:'1.6',
      fontSmooth:'auto',
      fontSize:'14px',
      color:'#242A2D',
    }}>
      <ReactMarkdown 
        plugins={[[gfm]]} 
        source={post} 
        escapeHtml={false} 
        renderers={markdownRenderers} 
      />
    </div>
  );
}

const markdownRenderers = {
  heading: heading,
  code: code,
  inlineCode: inlineCode,
  tableCell: tableCell,
  blockquote: blockquote
}

function heading(props) {
  let style = {
    margin:'15px 0 10px',
    lineHeight:'1.75',
    fontWeight:'bold',
  }

  switch (props.level) {
    case 1:
      style.fontSize='28px';
      style.borderBottom='solid 1px #EAECEF';
      break;
    case 2:
      style.fontSize='24px';
      style.borderBottom='solid 1px #EAECEF';
      break;
    case 3:
      style.fontSize='18px';
      break;
    case 4:
      style.fontSize='16px';
      break;
    case 5:
      style.fontSize='14px';
      break;
    case 6:
      style.fontSize='14px';
      style.color='#6A737D';
      break;
    default:
      // Do nothing
      break;
  }

  return (
    <div style={
      style
    }>
      {props.children}
    </div>
  );
}

function code(props) {
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
        fontSize:'0.85em',
      }}
      children={props.value}
    />
  );
}

function inlineCode(props) {
  return (
    <code style={{
      backgroundColor: '#F6F8FA',
      padding:'4px',
      fontSize:'12px',
    }}>
      {props.children}
    </code>
  );
}

function tableCell(props) {
  let style = {
    padding: '6px 13px',
  }

  if (props.isHeader) {
    style.borderTop = 'solid 1px #DFE2E5';
    style.borderBottom = 'solid 1px #DFE2E5';
    style.backgroundColor = '#F6F8FA';
    style.fontWeight = 'bold';
    style.textAlign = props.align ? props.align : 'center';
  } else {
    style.borderBottom = 'solid 1px #DFE2E5';
    style.textAlign = props.align ? props.align : 'left';
  }

  return (
    <td style={style}>
      {props.children}
    </td>
  );
}

function blockquote(props) {
  return (
    <div style={{
      borderLeft:'solid 3px #DFE2E5',
      paddingLeft:'14px',
      color:'#6A737D',
    }}>
      {props.children}
    </div>
  );
}

export default Markdown;
