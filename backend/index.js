const express = require("express");
require("dotenv");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const AuthRoutes = require("./Routes/AuthRoutes");
const tokenRoute = require("./Routes/TokenValidRout");
const apiRouter = require("./Routes/apiRouter");
const http = require("http");
const initializeSocket = require("./utils/socket");
const msgRouter = require("./Routes/msgRoutes");
require("./Models/db");

const server = http.createServer(app);
const port = process.env.PORT || 3000;

initializeSocket(server);

app.use(express.json());
app.use(
  cors({
    origin: ["http://3.108.61.73", "http://localhost:5173"],
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

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening on Port ${port}`);
});
