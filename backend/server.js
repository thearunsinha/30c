import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const port = process.env.PORT || 5000;

connectDB(); //Connect to MongoDB
const app = express();

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CookieParser middleware
app.use(cookieParser());

//Cors middleware
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/config/paypal", (req, res) =>
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  })
);

const __dirname = path.resolve();
const publicPath = path.join(__dirname, "/uploads");
app.use("/uploads", express.static(publicPath));

//Razorpay initiation
app.post("/api/config/razorpay", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    if (!req.body) {
      return res
        .status(400)
        .send({ message: "Please provide the payment details." });
    }
    const options = req.body;
    const paymentByRP = await razorpay.orders.create(options);
    if (!paymentByRP) {
      return res.status(400).send({
        message: "Something went wrong while initiating payment by RazorPay",
      });
    }
    res.json(paymentByRP);
  } catch (error) {
    res.status(500).send(error);
  }
});

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  //any route that is not api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
