import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const markdownRenderer = {
  heading: heading,
  code: code,
  image: image,
  inlineCode: inlineCode,
  table: table,
  link: link,
  blockquote: blockquote
}

function heading(props) {
  let style = {
    margin: '15px 0 10px',
    lineHeight: '1.75',
    fontWeight: 'bold',
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
      wrapLines={false} 
      lineProps={{style: {wordBreak: 'keep-all', whiteSpace: 'pre-wrap'}}}
      style={githubGist} 
      customStyle={{
        width: 'calc(100% - 32px)',
        marginRight: '-10000vw',
        borderRadius: '0.25em',
        padding: '16px',
        backgroundColor: '#F5F7F9',
        lineHeight: '1.5',
        fontSize: '0.85em',
      }}
      children={props.value}
    />
  );
}

function image(props) {
  return (
    <img 
      style={{
        width: '100%',
        maxWidth: '720px',
        marginRight: '-10000vw',
      }}
      src={props.src} 
      alt={props.alt}
    />
  )
}

function inlineCode(props) {
  return (
    <code style={{
      borderRadius: '0.25em',
      padding: '4px',
      backgroundColor: '#F1F2F2',
      fontSize: '0.875em',
    }}>
      {props.children}
    </code>
  );
}

function table(props) {
  let head = props.children[0];
  const headRows = [];
  if (head !== undefined) {
    head.props.children[0].props.children.forEach(it => {
      headRows.push((
        <th
          key={it.key}
          style={{
          border: '1px solid #DFE2E5',
          padding: '0.3em 0.75em',
          textAlign: it.props.align,
          fontWeight: 'bold'
          }}
        >
          {it.props.children[0].props.value}
        </th>
      ));
    });
  }

  let body = props.children[1];
  const bodyRows = [];
  if (body !== undefined) {
    let index = 0;
    body.props.children.forEach(it => {
      const row = [];
      it.props.children.forEach(it =>{
        let key = it.key;
        let align = it.align;
        let value = it.props?.children[0]?.props?.value;
        row.push((
          <td
            key={key}
            style={{
            border: '1px solid #DFE2E5',
            padding: '0.3em 0.75em',
            textAlign: align,
            backgroundColor: index % 2 == 0 ? 'white' : '#F5F7F9'
            }}
          >
            {value}
          </td>
        ))
      })

      bodyRows.push((
        <tr key={it.key}>
          {row}
        </tr>
      ));

      index++;
    });
  }

  return (
    <table style={{
      borderCollapse: 'collapse'
    }}>
      <thead>
        <tr>
          {headRows}
        </tr>
      </thead>
      <tbody>
        {bodyRows}
      </tbody>
    </table>
  )
}

function link(props) {
  return (
    <a 
      style={{
        wordBreak: 'break-all',
        textDecoration: 'none',
        color: '#115dcb'
      }}
      href={props.href}
    >
      {props.children[0].props.children}
    </a>
  )
}

function blockquote(props) {
  return (
    <div style={{
      borderLeft: 'solid 3px #DBDEE1',
      paddingLeft: '14px',
      color: '#6A737D',
    }}>
      {props.children}
    </div>
  );
}

export default markdownRenderer;