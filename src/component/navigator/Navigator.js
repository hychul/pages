import React from 'react';
import { Link } from 'react-router-dom';
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

function Navigator(props) {
  return (
    <div style={nav}>
      {/* Left */}
      <Link 
        style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0.5rem',
          padding: '0rem 0.5rem 0rem 0rem',
          textDecoration: 'none',
        }}
        to={{pathname: `/`}} replace
      >
        <img 
          style={{
            width: '3rem', 
            height: '3rem', 
            backgroundColor: '#49C5B1',
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
          color: '#49C5B1',
          fontSize: '25px',
          fontWeight: '700'
        }}>
          hychul.io
        </div>
      </Link>
      {/* Right */}
      <div style={{
        display: 'flex',
      }}>
        <Link
          to={{
            pathname: `/tags`,
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '3.5rem',
            textDecoration: 'none',
            backgroundColor: '#49C5B1',
            textAlign: 'center',
            verticalAlign: 'middle',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '12px'
        }}>
          TAGS
        </Link>
      </div>
    </div>
  );
}

export default Navigator;
