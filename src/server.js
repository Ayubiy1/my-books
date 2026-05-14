const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const bookRouter = require("./routes/book.js");
const userRouter = require("./routes/profile.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(require("cookie-parser")());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRouter);
app.use("/api/user", userRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// const authRoutes = require("../src/routes/auth.js");

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");

//     app.listen(3000, () => {
//       console.log("Server running on port 3000");
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
