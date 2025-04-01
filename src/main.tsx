import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx';
import { Analytics } from "@vercel/analytics/react"
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

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