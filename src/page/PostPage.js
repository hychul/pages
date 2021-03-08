import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

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
    <div>
      <div>post page</div>
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
  code: (props) => {
    return <SyntaxHighlighter style={dark} language={props.language} children={props.value} />
  },
  inlineCode: (props) => <code style={{backgroundColor: 'yellow'}}>{props.value}</code>,
  tableCell: tableCell
}

function tableCell(props) {
  let style = {
    textAlign: props.align ? props.align : 'center',
    padding: '1em'
  }

  if (props.isHeader) {
    style.backgroundColor = 'yellow';
    style.border = '1px solid black';
    style.borderLeft = '0px';
    style.borderRight = '0px';
  } else {
    style.borderBottom = '1px solid black';
  }

  return (
    <td style={style}>
      {props.children}
    </td>
  );
}

export default PostPage;
