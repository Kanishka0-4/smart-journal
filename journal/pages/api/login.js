import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("journal");
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}