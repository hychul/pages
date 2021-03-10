import React from 'react';
import logo from 'static/logo.svg';
import 'App.css';

function ReactPage() {
  return (
    <div style={{
      width:'100%',
      textAlign:'center',
    }}>
      <header 
        style={{
          minHeight:'100vh',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          backgroundColor: '#282C34',
          fontSize: 'calc(10px + 2vmin)',
          color:'white',
        }}
      >
        <img 
          src={logo} 
          className="App-logo"
          alt="logo" 
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          style={{
            color:'#61DAFB'
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
