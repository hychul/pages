import React, { useEffect, useState } from 'react';

function IndexSelector(props) {
  const [list, setList] = useState();

  const minIndex = props.minIndex ?? 1;
  const maxIndex = props.maxIndex ?? 1;
  const pageSize = props.pageSize ?? 10;
  const currentIndex = props.currentIndex ?? 1;
  const onIndex = props.onIndex;

  useEffect(() => {
    const list = [];

    let page = Math.floor((currentIndex - 1) / pageSize);
    let start = page * pageSize; // min max
    let end = Math.min(page * pageSize + pageSize, maxIndex); // min max

    if (currentIndex > pageSize) {
      list.push((
        <button
          key={`page index ${start}`}
          style={{
            background: 'none',
            border: 'none',
            margin: 'none',
            padding: 'none',
            cursor: 'pointer',
            fontSize: 'calc(0.75em + 0.5vmin)',
            color: '#6A737D',
          }}
          onClick={()=>{
             onIndex(start);
          }}
        >
          {'<'}
        </button>
      ));
    }

    for (let i = start; i < end; i++) {
      const index = i + minIndex;
      if (currentIndex == index) {
        list.push((
          <button
            key={`page index ${index}`}
            style={{
              background: 'none',
              border: 'none',
              margin: 'none',
              padding: 'none',
              cursor: 'pointer',
              fontSize: 'calc(0.75em + 0.5vmin)',
              fontWeight: 'bold',
              color: '#242A2D',
            }}
           >
            {index}
          </button>
        ));
      } else {
        list.push((
          <button
            key={`page index ${index}`}
            style={{
              background: 'none',
              border: 'none',
              margin: 'none',
              padding: 'none',
              cursor: 'pointer',
              fontSize: 'calc(0.75em + 0.5vmin)',
              color: '#6A737D',
            }}
           onClick={()=>{
              onIndex(index);
          }}>
            {index}
          </button>
        ));
      }
    }

    if (end < maxIndex) {
      list.push((
        <button
          key={`page index ${end + 1}`}
          style={{
            background: 'none',
            border: 'none',
            margin: 'none',
            padding: 'none',
            cursor: 'pointer',
            fontSize: 'calc(0.75em + 0.5vmin)',
            color: '#6A737D',
          }}
          onClick={()=>{
             onIndex(end + 1);
          }}
        >
          {'>'}
        </button>
      ));
    }

    setList(list);
  }, [pageSize, currentIndex, minIndex, maxIndex, onIndex]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: '240px',
    }}>
      {list}
    </div>
  );
}

export default IndexSelector;
