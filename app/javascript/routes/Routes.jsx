// app/javascript/routes/Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HelloWorld from '../components/HelloWorld';
// Import other components for different pages

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HelloWorld />} />
      {/* Define more routes for other components */}
    </Routes>
  </Router>
);

export default AppRoutes;
