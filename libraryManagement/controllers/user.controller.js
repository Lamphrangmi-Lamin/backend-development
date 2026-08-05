const users = [
  {
    id: 1,
    name: "Alice Jenkins",
    email: "alice@example.com",
  },
  {
    id: 2,
    name: "Marcus Cole",
    email: "marcus@example.com",
  },
  {
    id: 3,
    name: "Guest Shopper",
    email: "guest@store.local",
  },
];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const targetUser = users.find((user) => user.id === id);

  if (targetUser === undefined)
    return res.status(404).json({ error: "User not found" });

  return res.json(targetUser);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "name is required" });

  if (!email || email.trim() === "")
    return res.status(400).json({ error: "email is required" });

  const id = users.length + 1;
  const newUser = { id, name, email };

  users.push(newUser);

  return res.status(201).json({ message: "new user created", newUser });
};

exports.updateEmailById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const { email } = req.body;

  if (!email || email.trim() === "")
    return res.status(400).json({ error: "email required for update" });

  const indexToUpdate = users.findIndex((user) => user.id === id);

  if (indexToUpdate < 0)
    return res.status(404).json({ error: "user not found" });

  const targetUser = users[indexToUpdate];

  // ** Update operation
  targetUser.email = email;

  return res.json({ message: "email updated", targetUser });
};

exports.deleteUserById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: "id must be of type number" });

  const indexToDelete = users.findIndex((user) => user.id === id);

  if (indexToDelete < 0) return res.status(404).send();

  users.splice(indexToDelete, 1);

  return res.status(204).json({ message: "user deleted" });
};
