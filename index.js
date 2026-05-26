import express from "express";
import { verifyEmail } from "./src/verifyEmail.js";
import { getDidYouMean } from "./src/getDidYouMean.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoint to verify email
app.post("/verify", async (req, res) => {
  const { email } = req.body;
  const result = await verifyEmail(email);
  res.json(result);
});

// API endpoint to suggest corrections
app.get("/suggest", (req, res) => {
  const { email } = req.query;
  const suggestion = getDidYouMean(email);
  res.json({ suggestion });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
