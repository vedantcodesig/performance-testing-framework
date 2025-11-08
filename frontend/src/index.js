import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This finds the div with id="root" in our HTML and puts our React app there
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);