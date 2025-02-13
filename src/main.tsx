import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>    
    <App /> 
    </Router>
  </StrictMode>,

);