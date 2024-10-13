import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductTile from './ProductsTile'; // Assuming ProductTile is used to display each product
import '../css/ProductsDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [showMore, setShowMore] = useState(false); // State to handle 'View More' functionality

    // Unwanted attributes to filter out
    const excludedKeys = ['_id', 'url', 'embedding', 'image', '1 Stars', '2 Stars', '3 Stars', '4 Stars', '5 Stars', 'ratings'];

    useEffect(() => {
        // Fetch product details
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.product);
                setProduct(data.product);
                setReviews(data.reviews);
            })
            .catch(error => console.error("Error fetching product details:", error));

        // Fetch similar products
        fetch(`http://localhost:5000/api/products/${id}/similar`)
            .then(response => response.json())
            .then(data => setSimilarProducts(data))
            .catch(error => console.error("Error fetching similar products:", error));
    }, [id]);

    // Handle null product case
    if (!product) return <div className="loading">Loading...</div>;

    // Helper function to render product attributes
    const renderProductAttributes = (product) => {
        const keys = Object.keys(product).filter(key => !excludedKeys.includes(key));

        // Display only a few details initially
        const visibleAttributes = keys.slice(0, 5);
        const hiddenAttributes = keys.slice(5);

        return (
            <div className="attributes">
                {visibleAttributes.map((key) => (
                    <div key={key} className="attribute-item">
                        <strong>{key.replace(/_/g, ' ')}:</strong> {product[key]}
                    </div>
                ))}
                {/* Render the hidden attributes when 'View More' is clicked */}
                {showMore && hiddenAttributes.map((key) => (
                    <div key={key} className="attribute-item">
                        <strong>{key.replace(/_/g, ' ')}:</strong> {product[key]}
                    </div>
                ))}
                {/* Toggle 'View More' / 'View Less' */}
                <button onClick={() => setShowMore(!showMore)} className="view-more-btn">
                    {showMore ? 'View Less' : 'View More'}
                </button>
            </div>
        );
    };

    return (
        <div className="product-detail-page">
            <div className="product-details">
                <h1>{product.Brand} {product.Model}</h1>
                <img src={product.image} alt={product.Model} />
                <p className="description">{product.Description}</p>
                <p className="price">Price: {product['Price in India']}</p>

                {/* Render product attributes */}
                {renderProductAttributes(product)}
            </div>

            {/* Display Reviews */}
            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review">
                            <p><strong>{review.reviewer_name}</strong> ({new Date(review.review_date).toDateString()}):</p>
                            <p className="rating">Rating: {review.rating} / 5</p>
                            <p className="review-text">{review.review}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}
            </div>

            {/* Display Similar Products */}
            <div className="similar-products-section">
                <h2>Similar Products</h2>
                <div className="product-grid">
                    {similarProducts.map(product => (
                        <ProductTile key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
