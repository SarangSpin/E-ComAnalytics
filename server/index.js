// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ProductSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    "Total Ratings": Number,
    "Picture URL": String,
    embedding: {
        type: [Number], // Array of numbers to store the embedding vector
        default: []     // Initialize with an empty array if no embedding exists
    }
    // Other fields as per your documents...
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    // Other user details...
});

const Products = mongoose.model('Products', ProductSchema);
const User = mongoose.model('User', UserSchema);
const Review = mongoose.model('Review', UserSchema);

// Routes for products
app.get('/api/products', async (req, res) => {
    const products = await Products.aggregate([
        { $sample: { size: 10 } }
    ]);
    res.json(products);
});

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    });
    await user.save();
    res.json({ message: 'User registered successfully' });
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const query = req.query.q;

        // Basic text search on multiple fields
        const products = await Products.find({
            $or: [
                { Brand: { $regex: query, $options: 'i' } },
                { Model: { $regex: query, $options: 'i' } },
                { "Model Name": { $regex: query, $options: 'i' } },
                { Type: { $regex: query, $options: 'i' } },
                // Add other fields you want to include in the search
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    const product = await Products.findById(req.params.id);
    // Fetch reviews for the product

    const reviews = await Review.find({ product_id: product._id });

    // Combine product details and reviews
    res.json({ product, reviews });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

app.get('/api/products/:id/similar', async (req, res) => {
    try {
        const productId = req.params.id;

        // Retrieve the product's embedding
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productEmbedding = product.embedding;
        if (!Array.isArray(productEmbedding) || productEmbedding.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing embedding vector' });
        }

        // Retrieve all other products' embeddings
        const allProducts = await Products.find({ _id: { $ne: productId } }).select('embedding');

        // Calculate cosine similarity for each product
        const similarProducts = allProducts.map(otherProduct => {
            const similarity = cosineSimilarity(productEmbedding, otherProduct.embedding);
            return {
                _id: otherProduct._id,
                similarity: similarity
            };
        });

        // Sort the products by similarity score in descending order
        similarProducts.sort((a, b) => b.similarity - a.similarity);

        // Get the top 5 most similar products
        const topSimilarProductsIds = similarProducts.slice(0, 5).map(product => product._id);

        // Fetch the full details for these top similar products
        const topSimilarProducts = await Products.find({ _id: { $in: topSimilarProductsIds } });

        // Attach the similarity score to each product detail
        // const topSimilarProductsWithScores = topSimilarProducts.map(product => {
        //     const similarityScore = similarProducts.find(p => p._id.equals(product._id)).similarity;
        //     return { ...product.toObject(), similarity: similarityScore };
        //});

        res.json(topSimilarProducts);
    } catch (error) {
        console.error('Error finding similar products:', error);
        res.status(500).json({ message: 'Error finding similar products' });
    }
});
