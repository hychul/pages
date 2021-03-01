import React from 'react';

const nav = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  position: 'sticky',
  height: '3.5rem',
  top: '-3.5rem',
  marginTop: '0px',
  backgroundColor: 'red'
}

function Navigator() {
  return (
    <div style={nav}>
      {/* Left */}
      <div style={{
        display: 'flex',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3.5rem', 
          backgroundColor: 'orange',
        }}
        onMouseOver={() => {
          console.log("over");
        }}
        onMouseOut={() => {
          console.log("out");
        }}
        onClick={() => {
          console.log("click");
        }}>
          A
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3.5rem', 
          backgroundColor: 'blue',
        }}>
          LOGO
        </div>
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // 
          backgroundColor: 'green',
          marginLeft: '0.25rem',
          marginRight: '0.25rem',
          // font
          color: 'white',
          fontSize: '1.2em',
          fontWeight: '700'
        }}>
          Hychul's Page
        </div>
      </div>
      {/* Right */}
      <div style={{
        display: 'flex',
      }}>
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3.5rem',
          backgroundColor: 'yellow',
          textAlign: 'center',
          verticalAlign: 'middle'
        }}>
          Right
        </div>
      </div>
    </div>
  );
}

export default Navigator;