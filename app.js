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

    // Function to generate a random ID
    function generateRandomId() {
        return Math.random().toString(36).substr(2, 9); // generates a random string
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Check if a userId cookie exists. If not, create one.
    let userId = getCookie("userId");
    if (!userId) {
        userId = generateRandomId();
        setCookie("userId", userId, 365); // store the cookie for 365 days
    }

    let conversationLog = []

    function useRecordedSpeech() {
        conversationLog.push({ role: "user", content: recordedSpeech });

        console.log(recordedSpeech);
    
        fetch('http://localhost:5000/respond', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: recordedSpeech,
                conversationLog: conversationLog,
                userId: userId // Send the userId to the server
            })
        })
        .then(response => response.json())
        .then(response => {
            // Fallback if the response is empty or doesn't meet certain criteria
            let botResponse = response.data;
            if (!botResponse || botResponse.trim() === "") {
                botResponse = "I don't understand.";
            }
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