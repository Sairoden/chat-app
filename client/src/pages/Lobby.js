import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
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
