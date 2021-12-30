/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import HomeScreen from './containers/HomeScreen/HomeScreen';
import LoginScreen from './containers/LoginScreen/LoginScreen';
import PrivateRoute from './containers/PrivateRoute';
import RegisterScreen from './containers/RegisterScreen/RegisterScreen';
import { getLocalStorageToken, setLocalStorageToken } from './utils/authManager';

function App({ localJwtToken }: { localJwtToken: string }) {

  useEffect(() => {
    const jwt = getLocalStorageToken();
    jwt && setJwtToken(localJwtToken);
  }, [])

  const onSetJwtToken = (jwt: string) => {
    setJwtToken(jwt);
    setLocalStorageToken(jwt);
  }

  const [jwtToken, setJwtToken] = useState('');

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
    <div className="App" style={{ width: screenSize.dynamicWidth }}>
      <Routes>
        <Route path="/login" element={<LoginScreen setJwtToken={onSetJwtToken} />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={
          <PrivateRoute jwtToken={localJwtToken || jwtToken}>
            <HomeScreen jwtToken={localJwtToken || jwtToken} setJwtToken={onSetJwtToken} />
          </PrivateRoute>
        }
        />
      </Routes>
    </div>
  );
}

export default App;
