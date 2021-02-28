import React, { Fragment } from 'react';

function Copyright() {
  return (
    <Fragment>
      <hr
        style={{
          color: 'red',
          backgroundColor: 'green',
          height: '5'
        }}
      />
      <div 
        style={{
          marginTop:'30px',
          marginBottom:'30px',
          textAlign:'center'
        }}
      >
        © 2021. Hychul all rights reserved.
      </div>
    </Fragment>
  )
}

export default Copyright;
