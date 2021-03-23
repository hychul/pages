import React, { useEffect, useState } from 'react';

function PageIndice(props) {
  const [list, setList] = useState();

  const minIndex = props.minIndex ?? 1;
  const maxIndex = props.maxIndex ?? 1;
  const onClickIndex = props.onClickIndex;

  useEffect(() => {
    const list = [];
    for (let i = 0; i < maxIndex - minIndex + 1; i++) {
      const index = i + minIndex;
      if (props.currentIndex === index) {
        list.push((
          <button
            key={`page index ${i}`}
            style={{
              background: 'none',
              border: 'none',
              margin: 'none',
              padding: 'none',
              cursor: 'pointer',
              fontSize: '20px',
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
              color: '#242A2D',
            }}
           onClick={()=>{
              onClickIndex(index);
          }}>
            {index}
          </button>
        ));
      }
    }
    setList(list);
  }, [props.currentIndex, minIndex, maxIndex, onClickIndex]);

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

export default PageIndice;
