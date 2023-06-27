/*
* Nitzan Saar
*/
$(function () {

  // Get references to the input and button elements
  var $button = $('#send-button');
  var $messages = $('.messages');
  var $GenerateVideo = $('#generate-button');
  var $hiddenDiv = $('.hidden');

  var $record = $('choose-input');

  var $messages = $('#messages');

  var capturedText = ""; // will need to store the recorded text

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

        let recordedSpeech = ""; // do we need?

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

            // Save the transcript to the variable?
            recordedSpeech = transcript;
        });

        // Function to use the recorded speech
        function useRecordedSpeech() {
            console.log(recordedSpeech);

        // make a fetch request
        fetch('http://localhost:5000/respond', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({ prompt: recordedSpeech }) // Here, you are sending recordedSpeech to the server
        })
        .then(response => response.json())
        .then(response => {
            console.log(response.data); // inspect the structure of the data
            document.getElementById('chatgpt-response').textContent = response.data;
            const msg = new SpeechSynthesisUtterance(response.data);
            window.speechSynthesis.speak(msg);
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