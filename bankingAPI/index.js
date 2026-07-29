const express = require("express");
const { error } = require("node:console");
const app = express();
const PORT = 8007;

// ? Middleware
app.use(express.json());

const accounts = [
  {
    id: 1,
    name: "Alice Jenkins",
    balance: 2500.0,
  },
  {
    id: 2,
    name: "Marcus Cole",
    balance: 45.5,
  },
  {
    id: 3,
    name: "Sophia Patel",
    balance: 10400.75,
  },
  {
    id: 4,
    name: "Liam O'Connor",
    balance: 0.0,
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    balance: 320.25,
  },
];

// ** Route handling

// ? PATCH /accounts/:id?deposit
app.patch("/accounts/:id/deposit", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const { amount } = req.body;
  if (amount === undefined || typeof amount !== "number" || amount < 0)
    return res
      .status(400)
      .json({ error: "Amount cannot be negative and must be a number" });

  const targetIndex = accounts.findIndex((acc) => acc.id === id);
  if (targetIndex < 0)
    return res.status(404).json({ error: "Bank account not found" });

  // ** Update balance
  const targetAcc = accounts[targetIndex];
  targetAcc.balance += amount;

  return res.json({ message: "Amount deposit complete", account: targetAcc });
});

// ? PATCH /accounts/:id/withdraw
app.patch("/accounts/:id/withdraw", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "ID must be of type number" });

  const { amount } = req.body;
  if (amount === undefined || typeof amount !== "number" || amount < 0)
    return res
      .status(400)
      .json({ error: "Amount cannot be negative and must be a number" });

  const targetIndex = accounts.findIndex((acc) => acc.id === id);
  if (targetIndex < 0)
    return res.status(404).json({ error: "Bank account not found" });

  const targetAcc = accounts[targetIndex];

  // ? Perform withdrawal operation
  if (targetAcc.balance < amount)
    return res.status(400).json({
      error: "Your account balance is Insufficient",
      account: targetAcc,
    });

  targetAcc.balance -= amount;
  return res.json({
    message: `Rs.${amount} debited from your account`,
    account: targetAcc,
  });
});

app.listen(PORT, () => console.log(`Server is up and running on PORT ${PORT}`));
