import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import BoardGenerator from './BoardGenerator';

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="" element={<BoardGenerator/>}/>
      <Route path=":slug" element={<BoardGenerator/>}/>
    </Routes>
  </HashRouter>
);

export default App;
