const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const mozelloRoutes = require("./routes/mozello");
const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(express.json());

// ROUTES
app.use("/mozello", mozelloRoutes);
app.use("/webhook", webhookRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Mozello Snippe Payment Middleware Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});