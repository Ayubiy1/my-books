const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.js");
const productsRouter = require("./routes/book.js");
const userRouter = require("./routes/profile.js");
const userCategory = require("./routes/category.js");
const userOrder = require("./routes/order.js");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", userCategory);
app.use("/api/orders", userOrder);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
      console.log("Swagger docs: https://my-books-n5re.onrender.com/api-docs");
    });
  })
  .catch((err) => {
    console.log(err);
  });

{
  // const express = require("express");
  // const mongoose = require("mongoose");
  // const dotenv = require("dotenv");
  // const cors = require("cors");
  // const authRoutes = require("./routes/auth.js");
  // const productsRouter = require("./routes/book.js");
  // const userRouter = require("./routes/profile.js");
  // const userCategory = require("./routes/category.js");
  // const swaggerDocument = require("./swagger.json");
  // dotenv.config();
  // const app = express();
  // app.use(cors());
  // app.use(express.json());
  // app.use(require("cookie-parser")());
  // const swaggerJsdoc = require("swagger-jsdoc");
  // const swaggerUi = require("swagger-ui-express");
  // const { serve } = require("swagger-ui-express");
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // app.use("/api/auth", authRoutes);
  // app.use("/api/books", productsRouter);
  // app.use("/api/users", userRouter);
  // app.use("/api/category", userCategory);
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
}
