import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AdminDashboard from './components/AdminDashboard';
import UserLandingPage from './components/UserLandingPage';
import OwnerDashboard from './components/OwnerDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/user/landing" element={<UserLandingPage />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
