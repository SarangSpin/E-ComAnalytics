import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductTile from './ProductsTile'; // Assuming ProductTile is used to display each product

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        // Fetch product details
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(response => response.json())
            .then(data => {
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

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h1>{product.Brand} {product.Model}</h1>
            <img src={product.image} alt={product.Model} />
            <p>{product.Description}</p>
            <p>Price: {product['Price in India']}</p>

            {/* Display Reviews */}
            <h2>Customer Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <p><strong>{review.reviewer_name}</strong> ({new Date(review.review_date).toDateString()}):</p>
                        <p>Rating: {review.rating} / 5</p>
                       <p className="reviewText">{review.review}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet</p>
            )}

            {/* Display Similar Products */}
            <h2>Similar Products</h2>
            <div className="product-grid">
                {similarProducts.map(product => (
                    <ProductTile key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductDetailPage;
