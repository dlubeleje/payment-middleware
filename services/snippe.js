const axios = require("axios");

const API_KEY = process.env.SNIPPE_API_KEY;
const BASE_URL = process.env.SNIPPE_BASE_URL;

async function createPayment(order) {
  const response = await axios.post(
    `${BASE_URL}/payments`,
    {
      amount: order.amount,
      currency: "TZS",
      method: order.method || "mobile_money",
      reference: order.order_id,
      customer: {
        name: order.customer_name,
        email: order.email,
        phone: order.phone
      },
      callback_url: `${process.env.BASE_URL}/webhook/snippe`,
      success_url: order.success_url,
      fail_url: order.fail_url
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

module.exports = { createPayment };