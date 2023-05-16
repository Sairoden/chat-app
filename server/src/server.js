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

    socket.join(user.room);

    socket.broadcast
      .to(user.room)
      .emit(
        "sendMessage",
        generateMessage(user.username, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (userData, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(userData.message))
      return callback("Bad words aren't allowed");

    io.to(user.room).emit(
      "sendMessage",
      generateMessage(userData.username, userData.message)
    );
  });

  socket.on("sendLocation", locationData => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "sendLocation",
      generateLocationMessage(locationData.username, locationData.myLocation)
    );
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      socket.broadcast
        .to(user.room)
        .emit(
          "sendMessage",
          generateMessage(user.username, `${user.username} has left the chat`)
        );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
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

// 22 ka  na
