import React, { useState, useEffect } from 'react';
import './App.css';
// import { io } from "socket.io-client";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";


const socket = io('http://localhost:3000');

function App() {

  useEffect(() => {

  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className='btn' onClick={() => {
          console.log('----');
          socket.emit('chat message', 'chat');
        }}>chat</div>
        <a
          className="App-link"
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

export default App;
