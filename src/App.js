import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TemporaryDrawer from './components/drawer';
import AccountMenu from './components/navbar';
import adminroutes from './pages/admin-routes';

function App() {
  return (
    <BrowserRouter>
      <AccountMenu />
      <Routes>
        <Route path="/inbox" Component={adminroutes} />{' '}
        {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
