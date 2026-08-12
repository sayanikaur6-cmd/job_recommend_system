import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:8000";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const [chats, setChats] = useState([
    {
      sender: "bot",
      text: "Hi! I am CareerSync AI. Loading your personal career session...",
    },
  ]);

  const chatBodyRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chats, loading]);

  // Session initialize when widget opens
  useEffect(() => {
    if (open && !sessionId) {
      initChatSession();
    }
  }, [open]);

  const initChatSession = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/job-chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: "Candidate" }),
      });
      const data = await res.json();

      if (res.ok) {
        setSessionId(data.session_id);
        setChats([
          {
            sender: "bot",
            text: data.response || "Hi! I am CareerSync AI. How can I help you today?",
          },
        ]);
      } else {
        throw new Error(data.detail || "Failed to start chat session");
      }
    } catch (error) {
      setChats([
        {
          sender: "bot",
          text: "Hi! I am CareerSync AI. Could not connect to backend server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (userTextToSend) => {
    const textToSend = userTextToSend || message;
    if (!textToSend.trim() || loading) return;

    setChats((prev) => [...prev, { sender: "user", text: textToSend }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/job-chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: textToSend,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setChats((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.response,
          },
        ]);
      } else {
        throw new Error(data.detail || "Error from server");
      }
    } catch (error) {
      setChats((prev) => [
        ...prev,
        {
          sender: "bot",
          text: error.message || "Sorry, I could not connect to chatbot server.",
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
          cursor: pointer;
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
          display: flex;
          flex-direction: column;
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
          cursor: pointer;
        }

        .chat-body {
          flex: 1;
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
          white-space: pre-line;
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

        /* Thinking Animation */
        .thinking-bubble {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          font-style: italic;
          color: #64748b;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: blink 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
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
          cursor: pointer;
        }

        .chat-send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          cursor: pointer;
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

          <div className="chat-body" ref={chatBodyRef}>
            <div className="quick-actions">
              <button onClick={() => handleSend("Recommend jobs for me")}>
                Recommend jobs
              </button>
              <button onClick={() => handleSend("How to improve my resume?")}>
                Resume help
              </button>
              <button onClick={() => handleSend("What skills should I learn?")}>
                Skill gap
              </button>
              <button onClick={() => handleSend("Give interview tips")}>
                Interview tips
              </button>
            </div>

            {chats.map((chat, index) => (
              <div key={index} className={`chat-msg ${chat.sender}`}>
                <div className="chat-bubble">{chat.text}</div>
              </div>
            ))}

            {/* Dynamic Thinking Indicator */}
            {loading && (
              <div className="chat-msg bot">
                <div className="chat-bubble thinking-bubble">
                  <span>CareerSync AI is thinking</span>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask about jobs, resume, skills..."
              value={message}
              disabled={loading}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={loading}
            >
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