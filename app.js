$(function () {

  // Get references to the input and button elements
  var $button = $('#send-button');
  var $messages = $('.messages');
  var $GenerateVideo = $('#generate-button');
  var $hiddenDiv = $('.hidden');

  var $record = $('choose-input');

  var $messages = $('#messages');

  addMessage('AI Primer', 'How may I assist you?', 'received', showButtons);

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


        // Use the Web Speech API to speak the message
        var utterance = new SpeechSynthesisUtterance(content);
        speechSynthesis.speak(utterance);

      $message.append($sender).append($content);
      $messages.append($message);

  }
});