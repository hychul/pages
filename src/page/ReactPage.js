import React from 'react';
import logo from 'static/logo.svg';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Img = styled.img`
  height: 40vmin;
  pointer-events: none;
  animation: ${spin} infinite 20s linear;
`

function ReactPage() {
  return (
    <div style={{
      width: '100%',
      textAlign: 'center',
    }}>
      <header 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#282C34',
          fontSize: 'calc(10px + 2vmin)',
          color: 'white',
        }}
      >
        <Img 
          src={logo} 
          alt="logo" 
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          style={{
            color: '#61DAFB'
          }}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default ReactPage;
