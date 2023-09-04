AI Primer Chatbot
A comprehensive chatbot interface that integrates with OpenAI's GPT-4, offering voice input, text-to-speech output, and dynamic conversation management.

Table of Contents
Getting Started
Features
Usage
What I Learned
License
Getting Started
These instructions will help you set up the project on your local machine for development and testing purposes.

Prerequisites
Node.js and npm
MongoDB
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/nitzansaar/AI_Primer.git
Navigate to the project directory:

bash
Copy code
cd ai-primer-chatbot
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
Open your browser and navigate to http://localhost:5000.

Features
Voice Integration: Users can record their voice, and the chatbot responds both in text and synthesized voice.
API Integration: The backend seamlessly integrates with OpenAI's GPT-4 API, providing intelligent responses to user queries.
Conversation Management: Users can view their ongoing conversation and reset it whenever they want.
UI/UX: A clean and user-friendly interface facilitates interaction with the chatbot.
Usage
Starting a Conversation: Click the "Start Recording" button and speak your query. Once done, click the "Stop Recording" button.
Receiving a Response: After processing, the chatbot will provide a written response, which will also be read aloud.
Resetting the Conversation: Click the "Reset Conversation" button to clear the conversation history.
What I Learned
Front-End & Back-End Collaboration: Developed a deeper understanding of how the frontend communicates with the backend, managing API calls efficiently.
Voice Technology Integration: Grasped the intricacies of integrating and utilizing the Web Speech API for speech-to-text and text-to-speech functionalities.
Database Management: Learned to manage conversation histories using MongoDB, storing, retrieving, and deleting data as necessary.
External API Integration: Gained experience in integrating with third-party APIs, specifically OpenAI's GPT-4, and handling their responses effectively.
Problem-Solving & Debugging: Tackled various challenges that arose during development, refining my debugging skills and enhancing my problem-solving capabilities.