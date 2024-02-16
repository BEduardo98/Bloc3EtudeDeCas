const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const articleRouter = require("./api/articles/articles.router");
const authMiddleware = require("./middlewares/auth");
const usersController = require("./api/users/users.controller");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.post("/login", usersController.login);
app.use("/api/articles", authMiddleware, articleRouter);

app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({
    status,
    message,
  });
});

module.exports = {
  app,
  server,
};
