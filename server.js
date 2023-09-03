const portNum = 5000;
const express = require("express");
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
const mongodbURI = process.env.MONGO_URI; 
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const ConversationSchema = new mongoose.Schema({
  userId: String,
  logs: Array
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/respond", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const userId = req.body.userId || "defaultUser";

    // Fetch the conversation log for the user
    let userConversation = await Conversation.findOne({ userId: userId });

    if (!userConversation) {
      userConversation = new Conversation({
        userId: userId,
        logs: []
      });
    }

    // Combine conversation history with the new prompt
    const fullPrompt = userConversation.logs.map(entry => `${entry.role}: ${entry.content}`).join("\n") + "\nUser: " + prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0.9,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });

    let aiResponse = response.data.choices[0].text.trim();

    // Check if the response is empty or doesn't make sense
    if (!aiResponse || aiResponse === "") {
      aiResponse = "I don't understand.";
    }

    // Update the conversation log
    userConversation.logs.push({ role: "user", content: prompt });
    userConversation.logs.push({ role: "ai", content: aiResponse });

    await userConversation.save();

    return res.status(200).json({ data: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.delete("/reset-conversation", async (req, res) => {
  try {
      const userId = req.body.userId || "defaultUser"; 

      // Find the conversation associated with the userId and delete it
      await Conversation.findOneAndDelete({ userId: userId });

      return res.status(200).json({ message: "Conversation history reset successfully" });
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || portNum;
app.listen(port, () => console.log('Listening on port:', port));
