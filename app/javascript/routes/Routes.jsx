// app/javascript/routes/Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Board />} />
      {/* Define more routes for other components if needed */}
    </Routes>
  </Router>
);

export default AppRoutes;
