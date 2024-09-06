import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AccountMenu from './components/navbar';
import adminroutes from './pages/admin-routes';

import PointsAdd from './pages/pointsAdd';
import Navbar from './components/navbar';
import addEvents from './pages/addEvents';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/inbox" Component={adminroutes} />{' '}
        <Route path="/contests" Component={addEvents} />{' '}
        <Route path="/points-add/:id" element={<PointsAdd />} />
        {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
