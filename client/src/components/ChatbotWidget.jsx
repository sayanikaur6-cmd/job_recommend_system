import { useState } from "react";
import { sendChatMessage } from "../api/chatbotApi";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([
    {
      sender: "bot",
      text: "Hi! I am CareerSync AI. I can help with jobs, profile, resume, skills, recommendations and interviews.",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userText = message;

    setChats((prev) => [...prev, { sender: "user", text: userText }]);
    setMessage("");

    try {
      setLoading(true);

      const data = await sendChatMessage(userText);

      setChats((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setChats((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            error.response?.data?.reply ||
            "Sorry, I could not connect to chatbot server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .chat-float-btn {
          position: fixed;
          right: 28px;
          bottom: 28px;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          color: white;
          font-size: 28px;
          z-index: 9999;
          box-shadow: 0 20px 55px rgba(14,165,233,0.45);
          transition: 0.25s ease;
        }

        .chat-float-btn:hover {
          transform: translateY(-5px) scale(1.05);
        }

        .chat-panel {
          position: fixed;
          right: 28px;
          bottom: 110px;
          width: 390px;
          height: 560px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          overflow: hidden;
          z-index: 9999;
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 30px 90px rgba(15,23,42,0.22);
          animation: slideChat 0.25s ease;
        }

        @keyframes slideChat {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-header {
          padding: 18px 20px;
          color: white;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 35%),
            linear-gradient(135deg, #0f172a, #1e3a8a, #6366f1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 45px;
          height: 45px;
          border-radius: 16px;
          background: rgba(255,255,255,0.18);
          display: grid;
          place-items: center;
          font-size: 22px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
        }

        .chat-header h6 {
          margin: 0;
          font-weight: 900;
        }

        .chat-header small {
          color: #dbeafe;
        }

        .chat-close {
          border: none;
          background: rgba(255,255,255,0.14);
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
        }

        .chat-body {
          height: 410px;
          overflow-y: auto;
          padding: 18px;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,0.08), transparent 35%),
            #f8fbff;
        }

        .chat-msg {
          display: flex;
          margin-bottom: 14px;
        }

        .chat-msg.user {
          justify-content: flex-end;
        }

        .chat-bubble {
          max-width: 78%;
          padding: 12px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.55;
          box-shadow: 0 10px 30px rgba(15,23,42,0.08);
        }

        .chat-msg.bot .chat-bubble {
          background: white;
          color: #0f172a;
          border-bottom-left-radius: 5px;
        }

        .chat-msg.user .chat-bubble {
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          color: white;
          border-bottom-right-radius: 5px;
        }

        .chat-input-area {
          padding: 14px;
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 10px;
        }

        .chat-input-area input {
          flex: 1;
          border: none;
          outline: none;
          background: #f1f5f9;
          border-radius: 999px;
          padding: 12px 16px;
        }

        .chat-send-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          color: white;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          box-shadow: 0 12px 30px rgba(99,102,241,0.35);
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .quick-actions button {
          border: none;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .chat-panel {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 96px;
            height: 560px;
          }

          .chat-float-btn {
            right: 18px;
            bottom: 18px;
          }
        }
      `}</style>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-brand">
              <div className="chat-avatar">
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <h6>CareerSync AI</h6>
                <small>Online • Job Assistant</small>
              </div>
            </div>

            <button className="chat-close" onClick={() => setOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="chat-body">
            <div className="quick-actions">
              <button onClick={() => setMessage("Recommend jobs for me")}>
                Recommend jobs
              </button>
              <button onClick={() => setMessage("How to improve my resume?")}>
                Resume help
              </button>
              <button onClick={() => setMessage("What skills should I learn?")}>
                Skill gap
              </button>
              <button onClick={() => setMessage("Give interview tips")}>
                Interview tips
              </button>
            </div>

            {chats.map((chat, index) => (
              <div key={index} className={`chat-msg ${chat.sender}`}>
                <div className="chat-bubble">{chat.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="chat-bubble">Typing...</div>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask about jobs, resume, skills..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button className="chat-send-btn" onClick={handleSend}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      )}

      <button className="chat-float-btn" onClick={() => setOpen(!open)}>
        {open ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-chat-dots-fill"></i>
        )}
      </button>
    </>
  );
};

export default ChatbotWidget;