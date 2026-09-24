require("dotenv").config();

const app = require("./src/app.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./src/db/db.js");
const authRoutes = require("./src/routes/authRoutes");

connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
