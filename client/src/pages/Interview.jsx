import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:8000";

export default function Interview() {
  const [role, setRole] = useState("Python Developer");
  const [sessionId, setSessionId] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [maxQuestions, setMaxQuestions] = useState(1);

  const [isRecording, setIsRecording] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  const [report, setReport] = useState(null);

  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);

  /* =========================
     VOICE INITIALIZATION
  ========================= */

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();

        const englishVoices = availableVoices.filter((v) =>
          v.lang.startsWith("en")
        );

        setVoices(englishVoices);

        const defaultIndex = englishVoices.findIndex(
          (v) =>
            v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Zira") ||
            v.name.includes("Samantha")
        );

        if (defaultIndex !== -1) {
          setSelectedVoice(defaultIndex);
        }
      }
    };

    loadVoices();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  /* =========================
     TEXT TO SPEECH
  ========================= */

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      if (voices[selectedVoice]) {
        utterance.voice = voices[selectedVoice];
      }

      utterance.rate = 0.95;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  /* =========================
     SPEECH RECOGNITION
  ========================= */

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser does not support Speech Recognition. Please use Google Chrome or Edge."
      );
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setIsRecording(false);
      return;
    }

    window.speechSynthesis.cancel();

    const instance = new SpeechRecognition();

    instance.continuous = true;
    instance.interimResults = false;
    instance.lang = "en-US";

    instance.onresult = (event) => {
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          const transcript =
            event.results[i][0].transcript.trim();

          setInput((prev) =>
            prev
              ? prev + " " + transcript
              : transcript
          );
        }
      }
    };

    instance.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);
    };

    instance.onend = () => {
      setIsRecording(false);
    };

    instance.start();

    recognitionRef.current = instance;

    setIsRecording(true);
  };

  /* =========================
     START INTERVIEW
  ========================= */

  const handleStartInterview = async () => {
    if (!role.trim()) {
      alert("Please enter a target job position.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/interview/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.response) {
        setSessionId(data.session_id);
        setIsStarted(true);
        setQuestionNumber(data.question_number);
        setMaxQuestions(data.max_questions);

        setMessages([
          {
            sender: "Interviewer",
            text: data.response,
            type: "ai",
          },
        ]);

        speakText(data.response);
      } else {
        alert(
          "Error: " +
            (data.detail ||
              "Failed to initialize session.")
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        "Network error. Make sure FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEND ANSWER
  ========================= */

  const handleSendMessage = async () => {
    if (
      isRecording &&
      recognitionRef.current
    ) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const text = input.trim();

    if (!text || loading) return;

    window.speechSynthesis.cancel();

    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text,
        type: "user",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/interview/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: text,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          "Error: " +
            (data.detail ||
              "Failed to process message.")
        );

        return;
      }

      if (data.is_complete) {
        setIsComplete(true);
        setReport(data);

        speakText(
          "The interview is complete. Here is your final performance evaluation."
        );
      } else if (data.response) {
        setQuestionNumber(
          data.question_number
        );

        setMaxQuestions(
          data.max_questions
        );

        setMessages((prev) => [
          ...prev,
          {
            sender: "Interviewer",
            text: data.response,
            type: "ai",
          },
        ]);

        speakText(data.response);
      }
    } catch (err) {
      console.error(err);

      alert(
        "Failed to communicate with server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESTART
  ========================= */

  const handleRestart = () => {
    window.speechSynthesis.cancel();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setSessionId(null);
    setIsStarted(false);
    setIsComplete(false);
    setMessages([]);
    setInput("");
    setReport(null);
    setQuestionNumber(1);
    setMaxQuestions(1);
    setIsRecording(false);
  };

  /* =========================
     REPORT DATA
  ========================= */

  const scores =
    report?.structured_result?.scores || {};

  const result =
    report?.structured_result || {};

  const totalScore =
    scores.total_score || 0;

  const progress =
    maxQuestions > 0
      ? Math.min(
          (questionNumber / maxQuestions) *
            100,
          100
        )
      : 0;

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="interview-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .interview-page {
          min-height: 100vh;
          padding: 35px 20px 70px;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(99,102,241,.22),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(14,165,233,.18),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(168,85,247,.18),
              transparent 35%
            ),
            #070b17;

          color: #fff;

          position: relative;
          overflow: hidden;
        }

        .interview-page::before {
          content: "";
          position: fixed;
          width: 450px;
          height: 450px;
          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(99,102,241,.16),
              transparent 70%
            );

          top: -180px;
          left: -150px;

          animation:
            floatOrb 9s ease-in-out infinite;

          pointer-events: none;
        }

        .interview-page::after {
          content: "";
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(56,189,248,.12),
              transparent 70%
            );

          bottom: -220px;
          right: -180px;

          animation:
            floatOrb 11s ease-in-out infinite reverse;

          pointer-events: none;
        }

        @keyframes floatOrb {
          0%,100% {
            transform: translate3d(0,0,0) scale(1);
          }

          50% {
            transform:
              translate3d(30px,-25px,0)
              scale(1.08);
          }
        }

        .interview-wrapper {
          max-width: 1180px;
          margin: auto;
          position: relative;
          z-index: 2;
        }

        /* ================= HEADER ================= */

        .hero-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;

          margin-bottom: 25px;

          animation:
            slideDown .7s ease both;
        }

        .brand-area {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .brand-icon {
          width: 55px;
          height: 55px;
          border-radius: 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 25px;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6,
              #06b6d4
            );

          box-shadow:
            0 10px 35px
            rgba(99,102,241,.35);

          animation:
            iconFloat 4s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .brand-text h1 {
          margin: 0;

          font-size: 25px;
          font-weight: 800;

          letter-spacing: -.7px;
        }

        .brand-text p {
          margin: 3px 0 0;

          color: #94a3b8;
          font-size: 13px;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 15px;

          border-radius: 999px;

          background:
            rgba(16,185,129,.08);

          border:
            1px solid
            rgba(16,185,129,.3);

          color: #6ee7b7;

          font-size: 12px;
          font-weight: 700;
        }

        .live-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #10b981;

          box-shadow:
            0 0 0 5px
            rgba(16,185,129,.12);

          animation:
            livePulse 1.5s infinite;
        }

        @keyframes livePulse {
          0%,100% {
            opacity: 1;
          }

          50% {
            opacity: .45;
          }
        }

        /* ================= MAIN CARD ================= */

        .main-card {
          border-radius: 30px;

          background:
            linear-gradient(
              145deg,
              rgba(17,24,39,.94),
              rgba(15,23,42,.92)
            );

          border:
            1px solid
            rgba(255,255,255,.08);

          box-shadow:
            0 35px 100px
            rgba(0,0,0,.45),
            inset 0 1px 0
            rgba(255,255,255,.05);

          overflow: hidden;

          animation:
            pageReveal .8s ease both;
        }

        @keyframes pageReveal {
          from {
            opacity: 0;
            transform:
              translateY(30px)
              scale(.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        /* ================= TOP BAR ================= */

        .top-bar {
          padding: 24px 30px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          border-bottom:
            1px solid
            rgba(255,255,255,.07);

          background:
            rgba(255,255,255,.015);
        }

        .interview-title h2 {
          margin: 0;

          font-size: 21px;
          font-weight: 800;
        }

        .interview-title p {
          margin: 5px 0 0;

          color: #64748b;
          font-size: 13px;
        }

        .question-badge {
          padding: 9px 16px;

          border-radius: 999px;

          background:
            rgba(99,102,241,.12);

          border:
            1px solid
            rgba(129,140,248,.3);

          color: #c7d2fe;

          font-size: 12px;
          font-weight: 700;
        }

        /* ================= SETUP ================= */

        .setup-section {
          padding: 45px 35px 50px;
        }

        .setup-content {
          max-width: 850px;
          margin: auto;
          text-align: center;
        }

        .ai-orb {
          width: 115px;
          height: 115px;

          margin: 0 auto 25px;

          border-radius: 35px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 48px;

          background:
            linear-gradient(
              135deg,
              rgba(99,102,241,.2),
              rgba(6,182,212,.2)
            );

          border:
            1px solid
            rgba(129,140,248,.35);

          box-shadow:
            0 0 0 12px
            rgba(99,102,241,.035),
            0 0 70px
            rgba(99,102,241,.25);

          animation:
            aiFloat 4s ease-in-out infinite;
        }

        @keyframes aiFloat {
          0%,100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(2deg);
          }
        }

        .setup-content h3 {
          margin: 0;

          font-size: 32px;
          font-weight: 900;

          letter-spacing: -1px;
        }

        .setup-content > p {
          color: #94a3b8;
          max-width: 600px;
          margin: 12px auto 30px;

          line-height: 1.7;
        }

        .setup-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr auto;

          gap: 13px;

          text-align: left;
        }

        .field-label {
          display: block;

          margin-bottom: 7px;

          color: #94a3b8;

          font-size: 11px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: .8px;
        }

        .premium-input,
        .premium-select {
          width: 100%;

          padding: 14px 16px;

          border-radius: 14px;

          border:
            1px solid
            rgba(255,255,255,.09);

          background:
            rgba(255,255,255,.045);

          color: #fff;

          outline: none;

          font-size: 14px;

          transition: .25s;
        }

        .premium-input::placeholder {
          color: #64748b;
        }

        .premium-input:focus,
        .premium-select:focus {
          border-color:
            rgba(129,140,248,.7);

          background:
            rgba(99,102,241,.07);

          box-shadow:
            0 0 0 4px
            rgba(99,102,241,.08);
        }

        .premium-select option {
          color: #111827;
          background: #fff;
        }

        .start-button {
          border: none;

          padding: 14px 25px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6,
              #06b6d4
            );

          color: white;

          font-weight: 800;

          cursor: pointer;

          white-space: nowrap;

          box-shadow:
            0 12px 30px
            rgba(99,102,241,.3);

          transition: .25s;
        }

        .start-button:hover:not(:disabled) {
          transform:
            translateY(-3px);

          box-shadow:
            0 18px 40px
            rgba(99,102,241,.45);
        }

        .start-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* ================= PROGRESS ================= */

        .progress-wrapper {
          padding: 0 30px 20px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;

          margin-bottom: 8px;

          color: #64748b;

          font-size: 11px;
          font-weight: 700;
        }

        .progress-track {
          height: 5px;

          background:
            rgba(255,255,255,.06);

          border-radius: 999px;

          overflow: hidden;
        }

        .progress-fill {
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #6366f1,
              #8b5cf6,
              #06b6d4
            );

          box-shadow:
            0 0 15px
            rgba(99,102,241,.5);

          transition:
            width .5s ease;
        }

        /* ================= CHAT ================= */

        .chat-area {
          display: grid;

          grid-template-columns:
            250px 1fr;

          min-height: 600px;
        }

        .interviewer-panel {
          padding: 35px 25px;

          border-right:
            1px solid
            rgba(255,255,255,.07);

          background:
            rgba(255,255,255,.015);

          text-align: center;
        }

        .interviewer-avatar {
          width: 105px;
          height: 105px;

          margin: 15px auto 20px;

          border-radius: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 43px;

          background:
            linear-gradient(
              135deg,
              #312e81,
              #4c1d95
            );

          border:
            1px solid
            rgba(167,139,250,.35);

          box-shadow:
            0 15px 40px
            rgba(99,102,241,.25);

          position: relative;
        }

        .interviewer-avatar::after {
          content: "";

          position: absolute;

          width: 14px;
          height: 14px;

          right: 5px;
          bottom: 5px;

          border-radius: 50%;

          background: #10b981;

          border: 3px solid #111827;
        }

        .interviewer-panel h4 {
          margin: 0;

          font-size: 17px;
          font-weight: 800;
        }

        .interviewer-panel p {
          color: #64748b;

          font-size: 12px;

          line-height: 1.6;
        }

        .side-status {
          margin-top: 30px;

          padding: 15px;

          border-radius: 16px;

          background:
            rgba(99,102,241,.06);

          border:
            1px solid
            rgba(99,102,241,.12);

          text-align: left;
        }

        .side-status-title {
          color: #94a3b8;

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: 1px;

          font-weight: 800;

          margin-bottom: 10px;
        }

        .side-status-row {
          display: flex;
          justify-content: space-between;

          font-size: 12px;

          margin-bottom: 8px;
        }

        .side-status-row span {
          color: #64748b;
        }

        /* ================= MESSAGES ================= */

        .chat-section {
          display: flex;
          flex-direction: column;

          min-width: 0;
        }

        .chat-box {
          flex: 1;

          padding: 30px;

          height: 475px;

          overflow-y: auto;

          display: flex;

          flex-direction: column;

          gap: 18px;

          scrollbar-width: thin;
          scrollbar-color:
            #334155 transparent;
        }

        .message-row {
          display: flex;

          gap: 10px;

          animation:
            messageIn .35s ease both;
        }

        .message-row.user-row {
          justify-content: flex-end;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform:
              translateY(10px)
              scale(.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .message-avatar {
          width: 32px;
          height: 32px;

          flex-shrink: 0;

          border-radius: 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #312e81,
              #6366f1
            );

          font-size: 14px;
        }

        .user-row .message-avatar {
          order: 2;

          background:
            linear-gradient(
              135deg,
              #0f766e,
              #06b6d4
            );
        }

        .message {
          max-width: 72%;

          padding: 14px 17px;

          border-radius: 18px;

          font-size: 14px;

          line-height: 1.65;

          color: #e2e8f0;

          white-space: pre-wrap;
        }

        .message.ai {
          background:
            rgba(255,255,255,.055);

          border:
            1px solid
            rgba(255,255,255,.07);

          border-top-left-radius: 5px;
        }

        .message.user {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: #fff;

          border-top-right-radius: 5px;

          box-shadow:
            0 10px 30px
            rgba(79,70,229,.2);
        }

        /* ================= THINKING ================= */

        .thinking {
          display: flex;
          align-items: center;

          gap: 6px;

          padding: 14px 17px;

          width: fit-content;

          background:
            rgba(255,255,255,.045);

          border-radius: 16px;

          border-top-left-radius: 5px;
        }

        .thinking span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #818cf8;

          animation:
            thinking 1.2s infinite;
        }

        .thinking span:nth-child(2) {
          animation-delay: .15s;
        }

        .thinking span:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes thinking {
          0%,100% {
            transform: translateY(0);
            opacity: .4;
          }

          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        /* ================= INPUT ================= */

        .input-area {
          padding: 20px 25px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          background:
            rgba(255,255,255,.02);

          display: flex;

          gap: 10px;

          align-items: flex-end;
        }

        .answer-input {
          flex: 1;

          min-height: 50px;
          max-height: 120px;

          padding: 14px 17px;

          resize: none;

          border-radius: 16px;

          border:
            1px solid
            rgba(255,255,255,.09);

          background:
            rgba(0,0,0,.18);

          color: #fff;

          outline: none;

          font-size: 14px;

          transition: .25s;
        }

        .answer-input::placeholder {
          color: #64748b;
        }

        .answer-input:focus {
          border-color:
            rgba(129,140,248,.65);

          box-shadow:
            0 0 0 4px
            rgba(99,102,241,.07);
        }

        .mic-button,
        .send-button {
          width: 50px;
          height: 50px;

          flex-shrink: 0;

          border-radius: 15px;

          border: none;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;

          transition: .25s;
        }

        .mic-button {
          background:
            rgba(255,255,255,.06);

          color: #cbd5e1;

          border:
            1px solid
            rgba(255,255,255,.08);
        }

        .mic-button:hover {
          transform:
            translateY(-2px);

          background:
            rgba(99,102,241,.15);
        }

        .mic-button.recording {
          background:
            #ef4444;

          color: white;

          box-shadow:
            0 0 0 8px
            rgba(239,68,68,.1),
            0 0 30px
            rgba(239,68,68,.35);

          animation:
            recordPulse 1.2s infinite;
        }

        @keyframes recordPulse {
          0%,100% {
            box-shadow:
              0 0 0 7px
              rgba(239,68,68,.08);
          }

          50% {
            box-shadow:
              0 0 0 13px
              rgba(239,68,68,.04);
          }
        }

        .send-button {
          width: auto;

          padding: 0 22px;

          color: #fff;

          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );

          box-shadow:
            0 10px 25px
            rgba(99,102,241,.25);
        }

        .send-button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 15px 30px
            rgba(99,102,241,.4);
        }

        .send-button:disabled,
        .mic-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        /* ================= REPORT ================= */

        .report-section {
          padding: 40px;
        }

        .report-hero {
          text-align: center;

          padding: 20px 0 35px;
        }

        .report-hero h2 {
          margin: 0 0 8px;

          font-size: 31px;
          font-weight: 900;
        }

        .report-hero p {
          color: #64748b;
          margin: 0;
        }

        .verdict {
          display: inline-block;

          margin-top: 15px;

          padding: 9px 17px;

          border-radius: 999px;

          background:
            rgba(16,185,129,.1);

          border:
            1px solid
            rgba(16,185,129,.25);

          color: #6ee7b7;

          font-size: 12px;

          font-weight: 800;
        }

        .report-overview {
          display: grid;

          grid-template-columns:
            220px 1fr;

          gap: 35px;

          padding: 30px;

          border-radius: 24px;

          background:
            rgba(255,255,255,.035);

          border:
            1px solid
            rgba(255,255,255,.07);
        }

        .score-area {
          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;
        }

        .score-ring {
          width: 155px;
          height: 155px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at center,
              #111827 57%,
              transparent 58%
            ),
            conic-gradient(
              #6366f1
              ${Math.max(
                0,
                Math.min(totalScore, 100)
              )}%,
              rgba(255,255,255,.06) 0
            );

          box-shadow:
            0 0 45px
            rgba(99,102,241,.18);
        }

        .score-number {
          font-size: 32px;
          font-weight: 900;
        }

        .score-caption {
          margin-top: 12px;

          color: #64748b;

          font-size: 12px;
          font-weight: 700;
        }

        .metrics {
          display: flex;
          flex-direction: column;

          justify-content: center;

          gap: 20px;
        }

        .metric-head {
          display: flex;
          justify-content: space-between;

          color: #cbd5e1;

          font-size: 13px;

          margin-bottom: 7px;
        }

        .metric-head strong {
          color: #fff;
        }

        .metric-track {
          height: 8px;

          border-radius: 999px;

          overflow: hidden;

          background:
            rgba(255,255,255,.06);
        }

        .metric-fill {
          height: 100%;

          border-radius: inherit;

          transition:
            width 1.2s ease;

          background:
            linear-gradient(
              90deg,
              #6366f1,
              #8b5cf6
            );
        }

        .metric-fill.communication {
          background:
            linear-gradient(
              90deg,
              #06b6d4,
              #3b82f6
            );
        }

        .metric-fill.problem {
          background:
            linear-gradient(
              90deg,
              #10b981,
              #22c55e
            );
        }

        .report-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 20px;

          margin-top: 20px;
        }

        .report-card {
          padding: 25px;

          border-radius: 22px;

          background:
            rgba(255,255,255,.035);

          border:
            1px solid
            rgba(255,255,255,.07);

          transition: .25s;
        }

        .report-card:hover {
          transform:
            translateY(-4px);

          border-color:
            rgba(129,140,248,.25);
        }

        .report-card h4 {
          margin: 0 0 17px;

          font-size: 16px;
        }

        .strength-title {
          color: #6ee7b7;
        }

        .improve-title {
          color: #fca5a5;
        }

        .report-list {
          list-style: none;

          padding: 0;
          margin: 0;
        }

        .report-list li {
          padding: 11px 13px;

          margin-bottom: 8px;

          border-radius: 12px;

          background:
            rgba(255,255,255,.035);

          color: #cbd5e1;

          font-size: 13px;

          line-height: 1.5;
        }

        .restart-wrapper {
          text-align: center;

          margin-top: 30px;
        }

        .restart-button {
          border: none;

          padding: 14px 27px;

          border-radius: 999px;

          color: white;

          font-weight: 800;

          cursor: pointer;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );

          box-shadow:
            0 12px 30px
            rgba(99,102,241,.25);

          transition: .25s;
        }

        .restart-button:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 18px 35px
            rgba(99,102,241,.4);
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 900px) {

          .chat-area {
            grid-template-columns: 1fr;
          }

          .interviewer-panel {
            display: none;
          }

          .setup-grid {
            grid-template-columns: 1fr;
          }

          .report-overview {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 650px) {

          .interview-page {
            padding:
              15px 10px 40px;
          }

          .top-bar {
            padding: 18px;
          }

          .hero-header {
            align-items: flex-start;
          }

          .brand-text h1 {
            font-size: 20px;
          }

          .live-badge {
            display: none;
          }

          .setup-section {
            padding:
              35px 18px;
          }

          .setup-content h3 {
            font-size: 25px;
          }

          .chat-box {
            padding: 20px 15px;
            height: 470px;
          }

          .input-area {
            padding: 15px;
          }

          .message {
            max-width: 88%;
          }

          .send-button {
            width: 50px;
            padding: 0;
            font-size: 0;
          }

          .send-button::after {
            content: "➤";
            font-size: 17px;
          }

          .report-section {
            padding: 22px 15px;
          }

          .report-grid {
            grid-template-columns: 1fr;
          }

          .score-ring {
            width: 135px;
            height: 135px;
          }

        }

      `}</style>

      <div className="interview-wrapper">

        {/* ================= HERO HEADER ================= */}

        <div className="hero-header">

          <div className="brand-area">

            <div className="brand-icon">
              🤖
            </div>

            <div className="brand-text">

              <h1>
                AI Interview Studio
              </h1>

              <p>
                Practice. Improve. Get hired.
              </p>

            </div>

          </div>

          <div className="live-badge">

            <span className="live-dot"></span>

            AI SYSTEM ONLINE

          </div>

        </div>


        {/* ================= MAIN ================= */}

        <div className="main-card">

          {/* HEADER */}

          <div className="top-bar">

            <div className="interview-title">

              <h2>
                AI Voice Interview
              </h2>

              <p>
                Realistic interview simulation
              </p>

            </div>

            {isStarted &&
              !isComplete && (
                <div className="question-badge">
                  Question{" "}
                  {questionNumber} /{" "}
                  {maxQuestions}
                </div>
              )}

          </div>


          {/* ================= SETUP ================= */}

          {!isStarted && (

            <div className="setup-section">

              <div className="setup-content">

                <div className="ai-orb">
                  🧠
                </div>

                <h3>
                  Ready for your interview?
                </h3>

                <p>
                  Simulate a real technical
                  interview with an AI interviewer.
                  Answer using your keyboard or
                  speak naturally using your microphone.
                </p>


                <div className="setup-grid">

                  <div>

                    <label className="field-label">
                      Target Position
                    </label>

                    <input
                      type="text"
                      className="premium-input"
                      placeholder="Python Developer"
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                    />

                  </div>


                  <div>

                    <label className="field-label">
                      Interviewer Voice
                    </label>

                    <select
                      className="premium-select"
                      value={selectedVoice}
                      onChange={(e) =>
                        setSelectedVoice(
                          Number(e.target.value)
                        )
                      }
                    >

                      {voices.length === 0 ? (

                        <option>
                          Loading voices...
                        </option>

                      ) : (

                        voices.map(
                          (voice, idx) => (
                            <option
                              key={idx}
                              value={idx}
                            >
                              {voice.name}{" "}
                              ({voice.lang})
                            </option>
                          )
                        )

                      )}

                    </select>

                  </div>


                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                    }}
                  >

                    <button
                      className="start-button"
                      onClick={
                        handleStartInterview
                      }
                      disabled={loading}
                    >

                      {loading
                        ? "⏳ Preparing..."
                        : "🚀 Start Interview"}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ================= INTERVIEW ================= */}

          {isStarted &&
            !isComplete && (

              <>

                {/* PROGRESS */}

                <div className="progress-wrapper">

                  <div className="progress-info">

                    <span>
                      INTERVIEW PROGRESS
                    </span>

                    <span>
                      {Math.round(progress)}%
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>


                <div className="chat-area">

                  {/* LEFT INTERVIEWER */}

                  <div className="interviewer-panel">

                    <div className="interviewer-avatar">
                      🤖
                    </div>

                    <h4>
                      AI Interviewer
                    </h4>

                    <p>
                      Your intelligent interview
                      partner is evaluating your
                      responses in real time.
                    </p>


                    <div className="side-status">

                      <div className="side-status-title">
                        Session
                      </div>

                      <div className="side-status-row">

                        <span>
                          Role
                        </span>

                        <strong>
                          {role}
                        </strong>

                      </div>

                      <div className="side-status-row">

                        <span>
                          Questions
                        </span>

                        <strong>
                          {maxQuestions}
                        </strong>

                      </div>

                      <div className="side-status-row">

                        <span>
                          Mode
                        </span>

                        <strong>
                          Voice + Text
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* CHAT */}

                  <div className="chat-section">

                    <div
                      className="chat-box"
                      ref={chatBoxRef}
                    >

                      {messages.map(
                        (msg, index) => (

                          <div
                            key={index}
                            className={`message-row ${
                              msg.type === "user"
                                ? "user-row"
                                : ""
                            }`}
                          >

                            <div className="message-avatar">
                              {msg.type === "user"
                                ? "👤"
                                : "🤖"}
                            </div>

                            <div
                              className={`message ${msg.type}`}
                            >
                              {msg.text}
                            </div>

                          </div>

                        )
                      )}


                      {loading && (

                        <div className="message-row">

                          <div className="message-avatar">
                            🤖
                          </div>

                          <div className="thinking">

                            <span />
                            <span />
                            <span />

                          </div>

                        </div>

                      )}

                    </div>


                    {/* INPUT */}

                    <div className="input-area">

                      <textarea
                        className="answer-input"
                        placeholder={
                          isRecording
                            ? "Listening... speak your answer"
                            : "Type your answer or use the microphone..."
                        }
                        value={input}
                        disabled={loading}
                        onChange={(e) =>
                          setInput(e.target.value)
                        }
                        onKeyDown={(e) => {

                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {

                            e.preventDefault();

                            handleSendMessage();

                          }

                        }}
                      />


                      <button
                        className={`mic-button ${
                          isRecording
                            ? "recording"
                            : ""
                        }`}
                        onClick={
                          toggleSpeechRecognition
                        }
                        disabled={loading}
                        title={
                          isRecording
                            ? "Stop recording"
                            : "Start voice input"
                        }
                      >

                        {isRecording
                          ? "⏹"
                          : "🎙️"}

                      </button>


                      <button
                        className="send-button"
                        onClick={
                          handleSendMessage
                        }
                        disabled={
                          loading ||
                          !input.trim()
                        }
                      >

                        {loading
                          ? "..."
                          : "Send ➤"}

                      </button>

                    </div>

                  </div>

                </div>

              </>

            )}


          {/* ================= REPORT ================= */}

          {isComplete &&
            report && (

              <div className="report-section">

                <div className="report-hero">

                  <h2>
                    🎉 Interview Complete
                  </h2>

                  <p>
                    Here's your AI-powered
                    performance evaluation.
                  </p>

                  <span className="verdict">
                    {result.verdict ||
                      "Completed"}
                  </span>

                </div>


                {/* SCORE */}

                <div className="report-overview">

                  <div className="score-area">

                    <div className="score-ring">

                      <div className="score-number">
                        {totalScore}
                        <span
                          style={{
                            fontSize: 16,
                            color: "#64748b",
                          }}
                        >
                          /100
                        </span>
                      </div>

                    </div>

                    <div className="score-caption">
                      OVERALL PERFORMANCE
                    </div>

                  </div>


                  <div className="metrics">

                    <div>

                      <div className="metric-head">

                        <span>
                          Technical Knowledge
                        </span>

                        <strong>
                          {scores.technical ||
                            0}%
                        </strong>

                      </div>

                      <div className="metric-track">

                        <div
                          className="metric-fill"
                          style={{
                            width: `${
                              scores.technical ||
                              0
                            }%`,
                          }}
                        />

                      </div>

                    </div>


                    <div>

                      <div className="metric-head">

                        <span>
                          Communication
                        </span>

                        <strong>
                          {scores.communication ||
                            0}%
                        </strong>

                      </div>

                      <div className="metric-track">

                        <div
                          className="metric-fill communication"
                          style={{
                            width: `${
                              scores.communication ||
                              0
                            }%`,
                          }}
                        />

                      </div>

                    </div>


                    <div>

                      <div className="metric-head">

                        <span>
                          Problem Solving
                        </span>

                        <strong>
                          {scores.problem_solving ||
                            0}%
                        </strong>

                      </div>

                      <div className="metric-track">

                        <div
                          className="metric-fill problem"
                          style={{
                            width: `${
                              scores.problem_solving ||
                              0
                            }%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>


                {/* STRENGTHS / IMPROVEMENTS */}

                <div className="report-grid">

                  <div className="report-card">

                    <h4 className="strength-title">
                      💪 Key Strengths
                    </h4>

                    <ul className="report-list">

                      {(
                        result.strengths || [
                          "Good attempt",
                        ]
                      ).map(
                        (str, i) => (
                          <li key={i}>
                            ✓ {str}
                          </li>
                        )
                      )}

                    </ul>

                  </div>


                  <div className="report-card">

                    <h4 className="improve-title">
                      🎯 Areas to Improve
                    </h4>

                    <ul className="report-list">

                      {(
                        result.areas_for_improvement || [
                          "Keep practicing",
                        ]
                      ).map(
                        (imp, i) => (
                          <li key={i}>
                            → {imp}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                </div>


                {/* RESTART */}

                <div className="restart-wrapper">

                  <button
                    onClick={
                      handleRestart
                    }
                    className="restart-button"
                  >
                    🔄 Start New Interview
                  </button>

                </div>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}