import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import Home from './pages/home';
import Menu from './pages/menu';
import Numbers from './pages/numbers';
import PharmaGo from './pages/pharmaGo'
import RxApp from './pages/RxApp';
import Creator from './pages/creator'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/numbers" element={<Numbers />} />
        <Route path="/pharmaGo" element={<PharmaGo />} />
        <Route path="/rx" element={<RxApp />} />
        <Route path="/creator" element={<Creator />} />
      </Route>
    </Routes>
  );
}

export default App;