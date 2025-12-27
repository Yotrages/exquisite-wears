import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import App from './App.tsx';
import { Analytics } from "@vercel/analytics/react"
import './index.css';
import { store } from './redux/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Analytics /> 
        <App /> 
      </Router>
    </Provider>
  </StrictMode>,
);