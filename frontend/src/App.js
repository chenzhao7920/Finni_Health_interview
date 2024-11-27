import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Dashboard from './pages/dashboard';
import Patients from './pages/patients';
import NotFound from './components/NotFound'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signin" replace />} /> {/* Redirect to SignIn by default */}
        <Route path="/auth/signin" element={<SignIn/>} />
        <Route path="/auth/signup" element={<SignUp/>} />
        <Route path="/analytics" element={<Dashboard/>} />
        <Route path="/patients" element={< Patients/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;