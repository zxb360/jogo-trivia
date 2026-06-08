import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginProvider from './context/LoginProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <LoginProvider>
    <BrowserRouter> 
      <StrictMode>
        <App />
      </StrictMode> 
    </BrowserRouter>
  </LoginProvider>
)
