import React from 'react';

const nav = {
  backgroundColor: 'red',
  width: '100%',
  position: 'sticky',
  height: '3.5rem',
  top: '-3.5rem',
  marginTop: '0px',
}

function Navigator() {
  return (
    <div style={nav}>
      {/* Left */}
      <div style={{
          display: 'inline-block',
          height: '100%',
          backgroundColor: 'yellow',
          textAlign: 'center',
          verticalAlign: 'middle',
      }}>
        <div style={{
          display: 'inline-block', 
          width: '3.5rem', 
          height: '100%',
          backgroundColor: 'orange'
        }}>
          <div style={{
            marginTop: 'calc(3.5rem / 2 - 0.5em)'
          }}>
            a
          </div>
        </div>
        <div style={{
          display: 'inline-block', 
          width: '3.5rem', 
          height: '100%',
          backgroundColor: 'blue',
        }}>
          <div style={{
            marginTop: 'calc(3.5rem / 2 - 0.5em)'
          }}>
            LOGO
          </div>
        </div>
        <div style={{
          display: 'inline-block',
          height: '100%',
          backgroundColor: 'green'}}
        >
          <div style={{
            marginTop: 'calc(3.5rem / 2 - 0.5em)',
            marginLeft: '0.25em',
            marginRight: '0.25em',
            fontWeight: '650',
            color: 'white'
          }}>
            Hychul's Page
          </div>
        </div>
      </div>
      {/* Right */}
      <div style={{
        display: 'inline-block',
        float: 'right',
        width: '3.5rem',
        height: '100%',
        backgroundColor: 'yellow',
        textAlign: 'center',
        verticalAlign: 'middle'
      }}>
        <div style={{
            marginTop: 'calc(3.5rem / 2 - 0.5em)'
        }}>
          Right
        </div>
      </div>
    </div>
  );
}

export default Navigator;