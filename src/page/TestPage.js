import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEST_DECREMENT, TEST_INCREMENT } from 'action/ActionType';

function TestPage() {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '1010px',
      margin: '32px'
    }}>
      <div className="Panel focus">
        TEST
      </div>
      <div 
        className="Panel"
        style={{
          flexDirection: 'column',
          rowGap: '10px',
          alignItems: 'center'
        }}
      >
        <div>
          counter : <b>{selector}</b>
        </div>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button onClick={() => dispatch({type: TEST_DECREMENT})}>
              DECREMENT
          </button>
          <button onClick={() => dispatch({type: TEST_INCREMENT})}>
            INCREMENT
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
