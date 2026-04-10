import express from "express";
import "dotenv/config";
import authRouter from "./routers/authRouter.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Check everything is working or not");
});

// ✅ Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Failed to connect DB:", err.message);
  });