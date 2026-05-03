// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const projectRoutes = require("./routes/projectRoutes");
// const taskRoutes = require("./routes/taskRoutes");

// const app = express();

// connectDB();

// app.use(cors({ origin: "*", credentials: true }));

// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.use((err, req, res, next) => {
//   console.error(err.message);
//   res.status(500).json({ error: "Server Error" });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ✅ connect DB
connectDB();

// ✅ FIXED CORS (important for deployment)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Server Error" });
});

// ✅ PORT (already correct)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});