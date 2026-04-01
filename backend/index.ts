import express from "express";
import "dotenv/config";
import cors from "cors";
import AuthRoutes from "./Routes/AuthRoutes.js";
import tokenRoute from "./Routes/TokenValidRout.js";
import apiRouter from "./Routes/apiRouter.js";
import http from "http";
import initializeSocket from "./utils/socket.js";
import msgRouter from "./Routes/msgRoutes.js";
import "./Models/db.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

initializeSocket(server);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://3.108.61.73",
      "http://localhost:5173",
      "https://chat-application-socket-io-nine.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/auth", AuthRoutes);
app.use("/verify", tokenRoute);
app.use("/connections", apiRouter);
app.use("/message", msgRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
