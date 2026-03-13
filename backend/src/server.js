import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body
if (ENV.NODE_ENV !== "production") {
  // In development, allow any origin so login doesn't fail with CORS / "Network Error"
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
} else {
  // In production, restrict to configured CLIENT_URL values
  const corsOrigins = (ENV.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (corsOrigins.length === 0) return cb(null, true);
        return corsOrigins.includes(origin)
          ? cb(null, true)
          : cb(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );
}
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
