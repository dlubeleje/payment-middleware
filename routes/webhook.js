const express = require("express");
const fs = require("fs-extra");

const router = express.Router();

// Snippe webhook handler
router.post("/snippe", async (req, res) => {
  try {
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
    console.error(err);
    res.status(500).send("ERROR");
  }
});

module.exports = router;