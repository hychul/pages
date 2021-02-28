import React, { Fragment } from 'react';

function Copyright() {
  return (
    <Fragment>
      <hr
        style={{
          border:'solid 0px',
          marginLeft: '2vmin',
          marginRight: '2vmin',
          height: '1px',
          backgroundColor: 'black'
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
