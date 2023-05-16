const Sidebar = ({ room, users }) => {
  return (
    <>
      <h2 className="room-title">{room}</h2>
      <h3 className="list-title">Users</h3>
      <ul className="users">
        {users && users.map(user => <li key={user.id}>{user.username}</li>)}
      </ul>
    </>
  );
};

export default Sidebar;
