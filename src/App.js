import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';  // Import the Header component
import SignUpWizard from './components/SignUp';
import ProgressBar from './components/ProgressBar';

const App = () => {
  return (
    <div className="App">
      
      <Header />
      {/* Your form and other components */}
      <SignUpWizard/>
    </div>
  );
};

export default App;
