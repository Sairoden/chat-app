const Message = ({ text, createdAt, myLocation }) => {
  return (
    <div className="message">
      <p>
        <span className="message__name">Some user name</span>
        <span className="message__meta">{createdAt}</span>
      </p>
      <p>
        {text || (
          <a href={myLocation} target="_blank" rel="noreferrer">
            my current location
          </a>
        )}
      </p>
    </div>
  );
};

export default Message;
