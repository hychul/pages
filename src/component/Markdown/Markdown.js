import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function Markdown(props) {
  const [source, setSource] = useState();

  try {
    const data = require(`static/post/${props.filename}`);
    fetch(data.default).then(it => it.text()).then(it => setSource(it));
  } catch (e) {
    setSource("The file you are looking for does not exist.");
  }

  return (
    <div style={{
      width:'100%',
      maxWidth:'1010px',
      margin:'0px',
      padding:'0px',
      backgroundColor:'white',
      fontFamily: 'Helvetica, arial, sans-serif',
      lineHeight:'1.45',
      fontSmooth:'auto',
      fontSize:'16px',
      color:'#242A2D',
    }}>
      <ReactMarkdown 
        plugins={[[gfm]]} 
        source={source} 
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
      style.fontSize='2em';
      style.borderBottom='solid 1px #EAECEF';
      break;
    case 2:
      style.fontSize='1.5em';
      style.borderBottom='solid 1px #EAECEF';
      break;
    case 3:
      style.fontSize='1.125em';
      break;
    case 4:
      style.fontSize='1em';
      break;
    case 5:
      style.fontSize='0.875em';
      break;
    case 6:
      style.fontSize='0.875em';
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
        backgroundColor:'#F5F7F9',
        borderRadius:'0.25em',
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
      backgroundColor: '#F1F2F2',
      padding:'4px',
      fontSize:'0.875em',
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
    style.backgroundColor = '#F5F7F9';
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
      borderLeft:'solid 3px #DBDEE1',
      paddingLeft:'14px',
      color:'#6A737D',
    }}>
      {props.children}
    </div>
  );
}

export default Markdown;
