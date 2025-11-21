const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to parse JSON bodies (Crucial for receiving the amount)
app.use(express.json());
app.use(cors());

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID_HERE',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET_HERE'
});

app.post('/create-order', async (req, res) => {
    try {
        // 1. Get the dynamic amount from the frontend request
        // The frontend sends { amount: 20000 } (which is 200 rupees in paise)
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        // 2. Create the order with the DYNAMIC amount
        const options = {
            amount: amount, // Uses the value sent from frontend (e.g., 20000)
            currency: currency || "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        // 3. Send order details back to frontend
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
