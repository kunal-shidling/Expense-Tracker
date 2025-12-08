import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nano from "../couchdb.js";

const usersDB = nano.db.use("users");

export const signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const existing = await usersDB.find({ selector: { email } });
    if (existing.docs.length)
      return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashed,
      createdAt: new Date(),
    };

    const result = await usersDB.insert(user);

    const token = jwt.sign(
      { userId: result.id, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Signup successful",
      token,
      userId: result.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const found = await usersDB.find({ selector: { email } });
    if (!found.docs.length)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = found.docs[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
