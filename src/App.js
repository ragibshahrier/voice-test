import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceLoaded, setIsVoiceLoaded] = useState(false);

  // Load ResponsiveVoice
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=206RQ6BM';
    script.onload = () => setIsVoiceLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Voice input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("SpeechRecognition not supported!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      respondWithVoice("This is a simulated AI response.");
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Speak AI response
  const respondWithVoice = (text) => {
    if (isVoiceLoaded && window.responsiveVoice) {
      window.responsiveVoice.speak(text, "US English Female");
    } else if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Voice Test</h1>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? "Listening..." : "Start Voice Input"}
      </button>
      <p><strong>Your Input:</strong> {message}</p>
    </div>
  );
}

export default App;
