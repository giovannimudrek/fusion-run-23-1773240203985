import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginScreen from './components/LoginScreen';

function App() {
  return <LoginScreen />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
