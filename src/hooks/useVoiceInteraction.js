import { useState, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import qaData from '../data/qa.json';

// Speech Recognition setup with webkit fallback
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Fuse.js setup for fuzzy Q&A matching
const fuse = new Fuse(qaData, {
  keys: ['question', 'keywords'],
  threshold: 0.4, // Lower = more strict matching
  includeScore: true
});

// Simple viseme mapping for lip-sync
const mapWordToViseme = (word) => {
  const vowelMap = {
    'a': 'viseme_A',
    'e': 'viseme_E', 
    'i': 'viseme_I',
    'o': 'viseme_O',
    'u': 'viseme_U'
  };
  
  const lowerWord = word.toLowerCase();
  
  // Find dominant vowel in word
  for (const char of lowerWord) {
    if (vowelMap[char]) {
      return { type: vowelMap[char], intensity: 0.8 };
    }
  }
  
  // Consonant fallback - slight jaw movement
  return { type: 'jaw_open', intensity: 0.3 };
};

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [visemeState, setVisemeState] = useState({ type: 'viseme_closed', intensity: 0 });
  
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  
  // STT: Start speech recognition
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }
    
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const finalTranscript = event.results[0][0].transcript;
        setTranscript(finalTranscript);
        handleQuestion(finalTranscript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    setIsListening(true);
    recognitionRef.current.start();
  }, []);
  
  // NLU: Search Q&A using Fuse.js
  const handleQuestion = useCallback((question) => {
    const results = fuse.search(question);
    const answer = results.length > 0 
      ? results[0].item.answer 
      : "I don't know the answer to that question. Could you try asking something else?";
    
    setCurrentAnswer(answer);
    speakAnswer(answer);
  }, []);
  
  // TTS: Speak answer with lip-sync
  const speakAnswer = useCallback((text) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.pitch = 1.0;
    utteranceRef.current.volume = 1.0;
    
    utteranceRef.current.onstart = () => {
      setIsSpeaking(true);
    };
    
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setVisemeState({ type: 'viseme_closed', intensity: 0 });
    };
    
    // TTS.onboundary: Map words to visemes for lip-sync
    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.slice(event.charIndex, event.charIndex + event.charLength);
        const viseme = mapWordToViseme(word);
        
        setVisemeState(viseme);
        
        // Decay viseme after short duration
        setTimeout(() => {
          setVisemeState(prev => ({ ...prev, intensity: prev.intensity * 0.3 }));
        }, 120);
      }
    };
    
    window.speechSynthesis.speak(utteranceRef.current);
  }, []);
  
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setVisemeState({ type: 'viseme_closed', intensity: 0 });
  }, []);
  
  return {
    isListening,
    isSpeaking,
    transcript,
    currentAnswer,
    visemeState,
    startListening,
    stopSpeaking,
    speakAnswer
  };
};
