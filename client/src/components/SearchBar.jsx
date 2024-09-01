import React, { useState } from 'react';
import '../css/SearchBar.css'

const SearchBar = ({ onSearchResults }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/products/search?q=${query}`);
            const results = await response.json();
            onSearchResults(results); // Pass the results back to HomePage
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
