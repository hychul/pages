import React from 'react';

function ReduxTest({count, onDecrement, onIncrement}) {
  return (
    <div 
        className="Panel"
        style={{
          flexDirection: 'column',
          rowGap: '10px',
          alignItems: 'center'
        }}
      >
        <div>
          counter : <b>{count}</b>
        </div>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button onClick={() => onDecrement()}>
              DECREMENT
          </button>
          <button onClick={() => onIncrement()}>
            INCREMENT
          </button>
        </div>
      </div>
  )
}

export default ReduxTest;