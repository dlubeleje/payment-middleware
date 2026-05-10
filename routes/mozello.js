const express = require("express");
const router = express.Router();
const { createPayment } = require("../services/snippe");

// MOZELLO BUY NOW ENTRY POINT
router.post("/payment", async (req, res) => {
  try {
    const order = req.body;

    const payment = await createPayment(order);

    // Mozello expects redirect URL
    res.json({
      redirect_url: payment.payment_url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Payment creation failed"
    });
  }
});

module.exports = router;