import React from 'react';
import './App.css';
import { ActionArea, ShortcutModal } from './components';

function App() {
  return (
    <div className='App'>
      <div className='header' aria-label='openpad-header'>
        <img src={'./logo512.png'} height='56' width='56' alt='openpad-logo' />
        <h1>OpenPad</h1>
      </div>
      <ActionArea />
      <ShortcutModal />
    </div>
  );
}

export default App;
