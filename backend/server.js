const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const connectDB = require("./config/db");
const rootRoutes = require("./routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.use("/", rootRoutes);

connectDB().catch((error) => {
  console.warn("MongoDB unavailable, continuing with in-memory storage:", error.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
