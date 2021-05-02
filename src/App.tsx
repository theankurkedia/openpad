import React from 'react';
import './App.css';
import Home from './pages/Home';
import { ShortcutModal } from './components';

function App() {
  return (
    <div className='App'>
      <div className='header' role='header' aria-label='openpad-header'>
        <img src={'./logo512.png'} height='56' width='56' alt='openpad-logo' />
        <h1>OpenPad</h1>
      </div>
      <Home />
      <ShortcutModal />
    </div>
  );
}

export default App;
