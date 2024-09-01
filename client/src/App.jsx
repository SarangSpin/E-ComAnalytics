import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'
import ProductDetailPage from './pages/ProductDetailPage';
// Add other necessary imports

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Add routes for registration, other pages */}
            </Routes>
        </Router>
    );
};

export default App;
