const express = require("express");
const router = express.Router();
const { createPayment } = require("../services/snippe");

router.post("/payment", async (req, res) => {
  try {

    // 🔐 MOZELLO SECURITY CHECK
    const mozelloKey = req.headers["x-mozello-api-key"];

    if (!mozelloKey || mozelloKey !== process.env.MOZELLO_API_KEY) {
      return res.status(401).json({
        error: "Unauthorized Mozello request"
      });
    }

    const order = req.body;

    const payment = await createPayment(order);

    return res.json({
      redirect_url: payment.payment_url
    });

  } catch (error) {
    console.error("Mozello payment error:", error);

    return res.status(500).json({
      error: "Payment initiation failed"
    });
  }
});

module.exports = router;
