import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Global CSS file for additional styles
import App from './App';  // Main component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Renders the app in the div with id 'root'
);
