import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Slider from './components/slider';


const App: React.FC = () => {
  return (
    <div className="App">  
      <Navbar />
      <Slider />
    </div>
  );
};

export default App;
