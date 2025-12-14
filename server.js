const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/translate", async (req, res) => {
  let { text, sourceLang, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or target language" });
  }

  // MyMemory does NOT support auto-detect
  // So we fallback to English if auto is selected
  if (sourceLang === "auto") {
    sourceLang = "en";
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.responseData || !data.responseData.translatedText) {
      throw new Error("Invalid API response");
    }

    res.json({
      translatedText: data.responseData.translatedText
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
