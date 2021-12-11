import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BoardGenerator from './BoardGenerator';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="" element={<Navigate replace to="/codenames-scaler" />}/>
      <Route path="codenames-scaler" element={<BoardGenerator/>}/>
      <Route path="codenames-scaler/:slug" element={<BoardGenerator/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;
