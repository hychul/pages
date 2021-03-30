import React, { useEffect, useState } from 'react';

function IndexSelector(props) {
  const [list, setList] = useState();

  const minIndex = props.minIndex ?? 1;
  const maxIndex = props.maxIndex ?? 1;
  const currentIndex = props.currentIndex ?? 1;
  const onIndex = props.onIndex;

  useEffect(() => {
    const list = [];
    for (let i = 0; i < maxIndex - minIndex + 1; i++) {
      const index = i + minIndex;
      if (currentIndex === index) {
        list.push((
          <button
            key={`page index ${i}`}
            style={{
              background: 'none',
              border: 'none',
              margin: 'none',
              padding: 'none',
              cursor: 'pointer',
              fontSize: '18px',
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
            key={`page index ${i}`}
            style={{
              background: 'none',
              border: 'none',
              margin: 'none',
              padding: 'none',
              cursor: 'pointer',
              fontSize: '18px',
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
    setList(list);
  }, [currentIndex, minIndex, maxIndex, onIndex]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px'
    }}>
      {list}
    </div>
  )
}

export default IndexSelector;
