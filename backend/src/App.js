import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth system running 🚀");
});

export default app;
