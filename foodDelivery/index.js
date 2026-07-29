const express = require("express");
const app = express();

const orders = [
  {
    id: 1,
    customer: "John Doe",
    items: ["Margherita Pizza", "Garlic Bread", "Coke"],
    status: "Preparing",
  },
  {
    id: 2,
    customer: "Sarah Smith",
    items: ["Chicken Tikka Masala", "Garlic Naan"],
    status: "Out for Delivery",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    items: ["Double Cheeseburger", "Large Fries", "Vanilla Shake"],
    status: "Delivered",
  },
  {
    id: 4,
    customer: "Emily Davis",
    items: ["Spicy Tuna Roll", "Salmon Sashimi", "Miso Soup"],
    status: "Preparing",
  },
  {
    id: 5,
    customer: "Alex Lee",
    items: ["Pad Thai", "Vegetable Spring Rolls"],
    status: "Delivered",
  },
  {
    id: 6,
    customer: "Jessica Taylor",
    items: ["Burrito Bowl", "Chips and Guacamole"],
    status: "Out for Delivery",
  },
];

// PATCH /orders/:id/status
app.patch("/orders/:id/status", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const targetIndex = orders.findIndex((order) => order.id === id);

  if (targetIndex < 0)
    return res.status(404).json({ error: "Order NOT found" });

  const targetOrder = orders[targetIndex];

  switch (targetOrder.status) {
    case "Preparing":
      targetOrder.status = "Out for Delivery";
      res.json({
        message: "Out for Delivery",
        order: targetOrder,
      });
      break;

    case "Out for Delivery":
      targetOrder.status = "Delivered";
      res.json({
        message: "Delivered",
        order: targetOrder,
      });
      break;

    case "Delivered":
      res.status(409).json({
        message: "Order already Delivered",
        order: targetOrder,
      });
      break;
  }
});

app.listen(8005, () => console.log("Server is up and running on PORT 8005"));
