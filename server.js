 /*
 * Nitzan Saar
 */
 const portNum = 5000;
 const express = require("express");
 const app = express();
 const { Configuration, OpenAIApi } = require("openai");
 require("dotenv").config();
 const cors = require('cors');

 app.use(cors()); // Enable CORS for all routes
 app.use(express.json());

 const configuration = new Configuration({
   apiKey: process.env.OPENAI_API_KEY,
 });
 const openai = new OpenAIApi(configuration);

 app.post("/respond", async (req, res) => {
   try {
    const prompt = req.body.prompt;
     const response = await openai.createCompletion({
       model: "text-davinci-003",
       prompt: prompt + ". answer as if you are my personal assistant",
       temperature: 0.9,
       max_tokens: 150,
       top_p: 1,
       frequency_penalty: 0.0,
       presence_penalty: 0.6,
       stop: [" Human:", " AI:"],
     });

     const aiResponse = response.data.choices[0].text.trim();
     return res.status(200).json({ data: aiResponse });
   } catch (error) {
     console.error("Error:", error);
     return res.status(500).json({ error: "Server error" });
   }
 });

 const port = process.env.PORT || portNum;
 app.listen(port, () => console.log('Listening on port:', port));