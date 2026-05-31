const fs = require("fs");
const path = require("path");

let chatbotData = [];

const loadDataset = () => {
  try {
    const filePath = path.join(
      __dirname,
      "../data/careersync_chatbot_20000_dataset.jsonl"
    );

    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);

    chatbotData = lines.map((line) => JSON.parse(line));

    console.log(`✅ Chatbot dataset loaded: ${chatbotData.length} rows`);
  } catch (error) {
    console.log("❌ Chatbot dataset load failed:", error.message);
    chatbotData = [];
  }
};

loadDataset();

const normalize = (text = "") => {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
};

const calculateScore = (userMessage, datasetQuery) => {
  const userWords = normalize(userMessage).split(/\s+/);
  const queryWords = normalize(datasetQuery).split(/\s+/);

  let score = 0;

  userWords.forEach((word) => {
    if (queryWords.includes(word)) {
      score++;
    }
  });

  return score;
};

exports.chatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please type your question.",
      });
    }

    if (chatbotData.length === 0) {
      return res.json({
        success: true,
        reply:
          "Chatbot dataset is not loaded. Please check server/data folder.",
      });
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const row of chatbotData) {
      const score = calculateScore(message, row.user_query);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = row;
      }
    }

    let reply = "";

    if (!bestMatch || bestScore === 0) {
      reply =
        "I can help you with job search, job recommendation, resume, profile update, skills, interview preparation, and application guidance. Please ask your question in a little more detail.";
    } else {
      reply = bestMatch.bot_response;
    }

    res.json({
      success: true,
      reply,
      intent: bestMatch?.intent || "unknown",
      category: bestMatch?.category || "general",
    });
  } catch (error) {
    console.log("CHATBOT ERROR:", error);

    res.status(500).json({
      success: false,
      reply: "Something went wrong in chatbot server.",
    });
  }
};