const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// 🔥 extension only from URL
const getExtension = (url) => {
  const cleanUrl = url.split("?")[0]; // remove query params
  const ext = path.extname(cleanUrl);

  return ext || ".jpg"; // fallback
};

// 🔥 MAIN FUNCTION
const downloadFile = async (fileUrl, folderPath = "files") => {
  try {
    const uploadDir = path.join(__dirname, `../uploads/${folderPath}`);

    // 📁 create folder if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 🔥 request
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    const ext = getExtension(fileUrl);
    const fileName = `${uuidv4()}_${Date.now()}${ext}`;
    const fullPath = path.join(uploadDir, fileName);

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ✅ return path
    return `/uploads/${folderPath}/${fileName}`;

  } catch (err) {
    console.error("Download Error:", err.message);
    return null;
  }
};

module.exports = downloadFile;