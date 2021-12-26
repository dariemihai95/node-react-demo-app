import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import HomeScreen from './containers/HomeScreen/HomeScreen';
import LoginScreen from './containers/LoginScreen/LoginScreen';
import PrivateRoute from './containers/PrivateRoute';
import RegisterScreen from './containers/RegisterScreen/RegisterScreen';
import themes from './utils/themes';

function App() {

  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight
  });

  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', setDimension);

    return (() => {
      window.removeEventListener('resize', setDimension);
    })
  }, [screenSize])

  return (
    <div className="App" style={{ backgroundColor: themes.colors.background, height: screenSize.dynamicHeight, width: screenSize.dynamicWidth }}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={
          <PrivateRoute>
            <HomeScreen />
          </PrivateRoute>
        }
        />
      </Routes>
    </div>
  );
}

export default App;
