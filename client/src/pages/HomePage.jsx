import React, { useState, useEffect } from 'react';
import ProductTile from './ProductsTile'; // Assuming you have this component to display individual products
import SearchBar from '../components/SearchBar';
import '../css/HomePage.css'


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Fetch initial products (e.g., 10 random products)
        fetch('http://localhost:5000/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div>
            <SearchBar onSearchResults={handleSearchResults} />
            <h1>Featured Products</h1>
            <div className="product-grid">
                {(searchResults.length > 0 ? searchResults : products).map(product => (
                    <ProductTile key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
