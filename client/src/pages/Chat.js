// Library
import { useState, useEffect } from "react";
import moment from "moment";
import { socket } from "../socket";

// Component
import Message from "../components/Message";
import { useUserContext } from "../context/UserContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useUserContext();

  const handleSubmit = e => {
    e.preventDefault();

    const message = e.target.messageInput.value;

    if (!message.length > 0) return;

    const userData = { message, username: user.username };

    socket.emit("sendMessage", userData);

    e.target.messageInput.value = "";
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) return alert("Location is not available");

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      let myLocation = `https://www.google.com/maps/@${latitude},${longitude}`;

      const locationData = { username: user.username, myLocation };

      socket.emit("sendLocation", locationData);
    });
  };

  useEffect(() => {
    socket.on("sendMessage", message => {
      let { text, createdAt, username } = message;

      createdAt = moment(createdAt).format("h:mm A");

      const newMessage = { username, text, createdAt };

      setMessages([...messages, newMessage]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on("sendLocation", myLocation => {
      const { createdAt, url, username } = myLocation;
      const date = moment(createdAt).format("MMM Do YYYY, h:mm A ");

      const newLocation = {
        username: username,
        myLocation: url,
        createdAt: date,
      };

      setMessages([...messages, newLocation]);
    });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat__sidebar"></div>
      <div className="chat__main">
        <div className="chat__messages">
          {messages &&
            messages.map(message => (
              <Message
                key={message.text + message.createdAt}
                text={message.text}
                createdAt={message.createdAt}
                myLocation={message.myLocation}
                username={message.username}
              />
            ))}
        </div>
        <div className="compose">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="message"
              placeholder="Message"
              name="messageInput"
              required
              autoComplete="off"
            />
            <button>Submit</button>
          </form>
          <button onClick={handleSendLocation}>Send location</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
