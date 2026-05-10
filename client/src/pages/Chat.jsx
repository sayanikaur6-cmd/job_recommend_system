import { useParams } from "react-router-dom";

const Chat = () => {
  const { userId } = useParams();

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 20 }}>
        <h3>Chat Page</h3>
        <p className="text-muted">Chat with user: {userId}</p>
      </div>
    </div>
  );
};

export default Chat;