import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoardGenerator from './BoardGenerator';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path=":slug" element={<BoardGenerator/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;
