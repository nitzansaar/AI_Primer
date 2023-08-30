$(function () {
    // DOM references
    const $button = $('#send-button');
    const $messages = $('#messages');
    const $hiddenDiv = $('.hidden');

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const input = document.getElementById("input");

    let recordedSpeech = "";
    let voices = [];
    window.speechSynthesis.onvoiceschanged = function() {
        voices = window.speechSynthesis.getVoices();
    };

    startButton.addEventListener("click", () => {
        isRecognitionActive = true;
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;

        // Clear previous response
        document.getElementById('chatgpt-response').textContent = "";
    });

    stopButton.addEventListener("click", () => {
        isRecognitionActive = false;
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    });


    recognition.addEventListener("end", () => {
        startButton.disabled = false;
        stopButton.disabled = true;
        useRecordedSpeech();

        // If recognition was stopped externally (e.g., an error), and we still want it active
    });

    recognition.addEventListener("error", (event) => {
        console.error("Recognition Error:", event.error);

        // Handle specific errors
    });

    recognition.addEventListener("result", event => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join("");
        input.textContent = transcript;

        recordedSpeech = transcript;
    });

    let conversationLog = []

    function useRecordedSpeech() {
        conversationLog.push({ role: "user", content: recordedSpeech });

        console.log(recordedSpeech);
        // if (voices.length === 0) {
        //     console.error("Voices not loaded yet");
        //     return;
        // }
    
        fetch('http://localhost:5000/respond', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: recordedSpeech, conversationLog: conversationLog }) // Send the whole conversationLog
        })
        .then(response => response.json())
        .then(response => {
            conversationLog.push({ role: "User", content: recordedSpeech });
            conversationLog.push({ role: "ai", content: response.data });

            console.log(response.data);
            document.getElementById('chatgpt-response').textContent += response.data;
            const msg = new SpeechSynthesisUtterance(response.data.replace(/^AI:\s*/, ""));

            const selectedVoice = voices.find(voice => voice.localService) || voices[48];
            msg.voice = selectedVoice; // Set the selected voice
            window.speechSynthesis.speak(msg);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    }
});