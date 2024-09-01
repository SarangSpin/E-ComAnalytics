import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductTile.css'

const ProductTile = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`}>
            <div className="product-tile">
                <img src={product.image} alt={product.Model} />
                <h3>{product.Brand} {product.Model}</h3>
                <p>Rating: {product.ratings}</p>
            </div>
        </Link>
    );
};

export default ProductTile;
