import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import markdownRenderer from './MardownRenderer';

function Markdown(props) {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1010px',
      border: '0px',
      margin: '0px',
      padding: '0px',
      backgroundColor: 'white',
      fontFamily: 'Helvetica, arial, sans-serif',
      lineHeight: '1.45',
      wordBreak: 'keep-all',
      fontSmooth: 'always',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscal',
      fontSize: '15px',
      color: '#242A2D',
    }}>
      <ReactMarkdown 
        plugins={[[gfm]]} 
        escapeHtml={false} 
        renderers={markdownRenderer} 
        source={props.source} 
      />
    </div>
  );
}

export default Markdown;
