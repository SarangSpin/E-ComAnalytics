import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
