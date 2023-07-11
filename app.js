$(function () {
  // Get references to the input and button elements
  var $button = $('#send-button');
  var $messages = $('.messages');
  var $GenerateVideo = $('#generate-button');
  var $hiddenDiv = $('.hidden');

  var $record = $('choose-input');

  var $messages = $('#messages');

  function showButtons() {
      setTimeout(function () {
          $('#buttons').show();
      }, 1500);
  }

  // Function for adding a message to the chat window
  function addMessage(sender, content, type, callback) {
      // Create a new message element
      var $message = $('<div>').addClass('message');
      var $sender = $('<div>').addClass('sender').text(sender + ':');
      var $content = $('<div>').addClass('content').addClass(type);

      // Add the message content one character at a time
      var index = 0;
      var messageInterval = setInterval(function () {
          if (index >= content.length) {
              clearInterval(messageInterval);
          } else {
              $content.text($content.text() + content.charAt(index));
              index++;
          }
      }, 50);

      $message.append($sender).append($content);
      $messages.append($message);
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const input = document.getElementById("input");

  let recordedSpeech = "";
  let conversationLog = [];

  startButton.addEventListener("click", () => {
      recognition.start();
      startButton.disabled = true;
      stopButton.disabled = false;
  });

  stopButton.addEventListener("click", () => {
      recognition.stop();
      startButton.disabled = false;
      stopButton.disabled = true;
  });

  recognition.addEventListener("result", event => {
      const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
      input.textContent = transcript;

      recordedSpeech = transcript;
  });

  window.speechSynthesis.onvoiceschanged = function() {
    var voices = window.speechSynthesis.getVoices();
  };

  function speakLongText(text, voice, index = 0) {
    // Show the avatar
    document.getElementById("avatar").style.display = "block";

    // Split the text into sentences (or smaller parts if needed)
    const parts = text.match(/[^\.!\?]+[\.!\?]+/g);
    const utterance = new SpeechSynthesisUtterance(parts[index]);
    utterance.voice = voice;

    utterance.onend = function () {
      if (parts.length > index + 1) {
        speakLongText(text, voice, index + 1);
      } else {
        // Hide the avatar when the AI is done speaking
        document.getElementById("avatar").style.display = "none";
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  // Function to use the recorded speech
  function useRecordedSpeech() {
      console.log(recordedSpeech);

      // make a fetch request
      fetch('http://localhost:5000/respond', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt: recordedSpeech }) // send recordedSpeech to the server
      })
      .then(response => response.json())
      .then(response => {
          console.log(response.data); // inspect the structure of the data
          document.getElementById('chatgpt-response').textContent += "\nAI: " + response.data;
          var voices = window.speechSynthesis.getVoices();
          var chosenVoice = voices[49];
          // Change this to use the speakLongText function instead of speechSynthesis.speak
          speakLongText(response.data, chosenVoice);

      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  recognition.addEventListener("end", () => {
      startButton.disabled = false;
      stopButton.disabled = true;
      useRecordedSpeech();
  });
});
