// Libraries
const http = require("http");
const app = require("./app");
const socketio = require("socket.io");
const Filter = require("bad-words");

// Utilities
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) return callback(error);

    console.log(user);

    socket.join(user.room);

    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined the chat`));

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) return callback("Bad words aren't allowed");

    io.to("avengers").emit("sendMessage", generateMessage(message));
  });

  socket.on("sendLocation", myLocation => {
    io.emit("sendLocation", generateLocationMessage(myLocation));
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user)
      socket.broadcast
        .to(user.room)
        .emit("message", generateMessage(`${user.username} hasleft the chat`));
  });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("🤯 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// 18
