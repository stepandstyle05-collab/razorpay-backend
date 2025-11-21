const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

// Try to load dotenv for local development, but ignore if missing (production/Render)
try {
    require('dotenv').config();
} catch (e) {
    console.log("dotenv not found, assuming variables are set in system environment.");
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Razorpay
// Ensure you have set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Render Dashboard
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID_HERE',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET_HERE'
});

// Route: Create Order
app.post('/create-order', async (req, res) => {
    try {
        // Get amount from frontend (in paise)
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount, 
            currency: currency || "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
