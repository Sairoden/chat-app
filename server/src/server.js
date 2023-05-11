const http = require("http");
const app = require("./app");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) return callback("Bad words aren't allowed");

    io.emit("sendMessage", generateMessage(message));
  });

  socket.on("sendLocation", myLocation => {
    io.emit("sendLocation", generateLocationMessage(myLocation));
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

// 13 - Working with Time
