const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routers/index");
const config = require("./api/apiConfig");

mongoose.set("strictQuery", true);

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: config.FRONT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// MongoDB Connection
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", mainRouter);

// Server
app.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT}`)
);
