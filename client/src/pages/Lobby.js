import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { socket } from "../socket";

const Lobby = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleSubmit = e => {
    const { username, room } = e.target;

    const newUser = {
      username: username.value,
      room: room.value,
    };

    socket.emit("join", newUser, error => {
      if (error) {
        alert(error);
        navigate("/");
      }
    });

    setUser(newUser);
    navigate("/chat");
  };

  return (
    <div className="centered-form">
      <div className="centered-form__box">
        <h1>Join</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Display name</label>
          <input type="text" name="username" required />

          <label htmlFor="room">Room</label>
          <input type="text" name="room" required />

          <button>Join</button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
