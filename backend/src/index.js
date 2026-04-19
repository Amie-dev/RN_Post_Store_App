import express from "express";
import "dotenv/config";
import authRouter from "./routers/authRouter.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/authMiddleware.js";
import bookRouter from "./routers/bookRouter.js";



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Check everything is working or not");
});


//auth
app.use("/api/auth", authRouter);

//book
app.use("/api/books",bookRouter)


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