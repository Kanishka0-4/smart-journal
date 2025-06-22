import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("journal user");
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    await users.insertOne({ name, email, password: hashed });
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}