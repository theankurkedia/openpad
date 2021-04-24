import React from 'react';
import './App.css';
import Home from './pages/Home';
import { ShortcutModal } from './components';

function App() {
  return (
    <div className='App'>
      <div className='header'>
        <img src={'./logo192.png'} height='46' width='46' alt='openpad-logo' />
        <h2>OpenPad</h2>
      </div>
      <Home />
      <ShortcutModal />
    </div>
  );
}

export default App;
