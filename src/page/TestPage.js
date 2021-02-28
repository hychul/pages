import React from 'react';
import markdown from 'static/../../_posts/2015-08-29-window-hard-disk-analyze.md';

const showFile = async (e) => {
  e.preventDefault()
  const reader = new FileReader()
  reader.onload = async (e) => { 
    const text = (e.target.result)
    console.log(text)
    alert(text)
  };
  reader.readAsText(e.target.files[0])
}

function TestPage() {
  const items = [];

  items.push(<div style={{ textAlign: 'center' }}>space for scroll start</div>);
  for (let i = 0; i < 100; i++) {
    items.push('|');
  }
  items.push(<div style={{ textAlign: 'center' }}>space for scroll end</div>);

  console.log(markdown);

  return (
    <div>
      <input type="file" onChange={(e) => showFile(e)} />
      <div>
        {items.map((element, index) => (
          <div key={index} style={{ textAlign: 'center' }}>{element}</div>
        ))}
      </div>
    </div>
  );
}

export default TestPage;