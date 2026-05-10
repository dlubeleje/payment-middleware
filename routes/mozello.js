const express = require("express");
const fs = require("fs-extra");
const crypto = require("crypto");

const router = express.Router();

// 🔐 VERIFY SNIPPE SIGNATURE
function verifySignature(req) {
  const signature = req.headers["x-snippe-signature"];
  const secret = process.env.SNIPPE_SIGNING_SECRET;

  const payload = JSON.stringify(req.body);

  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return signature === hash;
}

router.post("/snippe", async (req, res) => {
  try {

    // ❌ Reject fake requests
    if (!verifySignature(req)) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    let orders = await fs.readJson("./data/orders.json").catch(() => ({}));

    if (event.status === "success") {
      orders[event.reference] = {
        status: "PAID",
        data: event
      };
    } else {
      orders[event.reference] = {
        status: "FAILED",
        data: event
      };
    }

    await fs.writeJson("./data/orders.json", orders, { spaces: 2 });

    res.status(200).send("OK");

  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("ERROR");
  }
});

module.exports = router;
