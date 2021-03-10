import React from 'react';

const nav = {
  display: 'flex',
  justifyContent: 'space-between',
  position: 'sticky',
  top: '-4rem',
  marginTop: '0px',
  width: '100%',
  height: '4rem',
  backgroundColor: '#242A2D'
}

function Navigator() {
  return (
    <div style={nav}>
      {/* Left */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0.5em',
          marginLeft: '1rem',
          marginRight: '0rem',
          width: '2rem', 
          height: '2rem',
          backgroundColor: 'cyan',
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
          H
        </div>
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.5em',
          // font
          color: 'white',
          fontSize: '16px',
          fontWeight: '700'
        }}>
          hychul.io
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
