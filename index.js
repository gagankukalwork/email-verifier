import express from "express";
import { verifyEmail } from "./src/verifyEmail.js";
import { getDidYouMean } from "./src/getDidYouMean.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Verify endpoint
app.post("/verify", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await verifyEmail(email);
    res.json({ result });
  } catch (err) {
    console.error("Error in /verify:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Suggest endpoint
app.get("/suggest", (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email query is required" });
    }

    const suggestion = getDidYouMean(email);
    res.json({ suggestion });
  } catch (err) {
    console.error("Error in /suggest:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
