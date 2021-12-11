import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import BoardGenerator from './BoardGenerator';

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate replace to="/codenames-scaler" />}/>
      <Route path="/codenames-scaler" element={<BoardGenerator/>}/>
      <Route path="/codenames-scaler/:slug" element={<BoardGenerator/>}/>
    </Routes>
  </HashRouter>
);

export default App;
