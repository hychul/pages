import React from 'react';
import dduggy from 'static/image/dduggy.jpg';

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
        <img 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0.75rem',
            width: 'calc(4rem - 0.75rem * 2)', 
            height: 'calc(4rem - 0.75rem * 2)', 
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
          }}
          src={dduggy}
          alt="home"
        />
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // font
          color: 'white',
          fontSize: '21px',
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
          backgroundColor: '#0049db',
          textAlign: 'center',
          verticalAlign: 'middle',
          color: 'white',
        }}>
          L
        </div>
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3.5rem',
          backgroundColor: 'white',
          textAlign: 'center',
          verticalAlign: 'middle',
          color: '#FFB300',
        }}>
          M
        </div>
        <div style={{
          // center
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3.5rem',
          backgroundColor: '#FFB300',
          textAlign: 'center',
          verticalAlign: 'middle',
          color: 'white',
        }}>
          R
        </div>
      </div>
    </div>
  );
}

export default Navigator;
