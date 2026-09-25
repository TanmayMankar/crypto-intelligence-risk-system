require("dotenv").config();

const http = require("http");

const { initializeBinance } = require("./src/services/binanceService");
const { initializeMarketSocket } = require("./src/services/marketSocket");

const app = require("./src/app.js");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/db/db.js");

const authRoutes = require("./src/routes/authRoutes");
const marketRoutes = require("./src/routes/marketRoutes");

connectDB();

initializeBinance();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

app.use("/api/market", marketRoutes);

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize WebSocket server
initializeMarketSocket(server);