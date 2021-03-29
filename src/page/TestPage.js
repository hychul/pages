import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { TEST_DECREMENT, TEST_INCREMENT } from 'redux/action';
import queryStirng from 'query-string';

function TestPage({location}) {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.test);
  const store = useStore();

  console.log(selector.test);

  const query = queryStirng.parse(location.search);

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
          counter : <b>{selector.test}</b>
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
      <div className="Panel">
        query string : {location.search}, query object : {JSON.stringify(query)}
      </div>
    </div>
  );
}

export default TestPage;
