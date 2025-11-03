// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa o componente App
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Elemento 'root' não encontrado no index.html");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);