import { useState, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import qaData from '../data/qa.json';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Types for speech recognition with webkit fallback
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VisemeState {
  type: string;
  intensity: number;
}

interface VoiceInteractionReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  currentAnswer: string;
  visemeState: VisemeState;
  startListening: () => void;
  stopSpeaking: () => void;
  speakAnswer: (text: string) => void;
}

// ElevenLabs client setup
const elevenlabs = new ElevenLabsClient({
  apiKey: "sk_5560a8673a5d18b53c45a6cccef87c3620df80a6eb95270f"
});

// Speech Recognition setup with webkit fallback
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Fuse.js setup for fuzzy Q&A matching
const fuse = new Fuse(qaData, {
  keys: ['question', 'keywords'],
  threshold: 0.4, // Lower = more strict matching
  includeScore: true
});

// Simple viseme mapping for lip-sync
const mapWordToViseme = (word: string): VisemeState => {
  const vowelMap: Record<string, string> = {
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

export const useVoiceInteraction = (): VoiceInteractionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [visemeState, setVisemeState] = useState<VisemeState>({ type: 'viseme_closed', intensity: 0 });
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visemeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // STT: Start speech recognition
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }
    
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const finalTranscript = event.results[0][0].transcript;
        setTranscript(finalTranscript);
        handleQuestion(finalTranscript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    setIsListening(true);
    recognitionRef.current.start();
  }, []);
  
  // NLU: Search Q&A using Fuse.js
  const handleQuestion = useCallback((question: string) => {
    const results = fuse.search(question);
    
    let answer: string;
    let emotion: string = 'neutral';
    
    if (results.length > 0) {
      const result = results[0];
      answer = result.item.answer;
      
      // Determine emotional context based on question type
      const questionLower = question.toLowerCase();
      if (questionLower.includes('name') || questionLower.includes('who')) {
        emotion = 'happy';
      } else if (questionLower.includes('technology') || questionLower.includes('skills')) {
        emotion = 'excited';
      } else if (questionLower.includes('project') || questionLower.includes('work')) {
        emotion = 'proud';
      } else if (questionLower.includes('contact') || questionLower.includes('hire')) {
        emotion = 'interested';
      } else if (questionLower.includes('background') || questionLower.includes('experience')) {
        emotion = 'thoughtful';
      } else if (questionLower.includes('unique') || questionLower.includes('special')) {
        emotion = 'confident';
      }
    } else {
      answer = "I don't know the answer to that question. Could you try asking something else?";
      emotion = 'confused';
    }
    
    setCurrentAnswer(answer);
    speakAnswer(answer, emotion);
  }, []);
  
  // TTS: Speak answer with ElevenLabs and lip-sync simulation
  const speakAnswer = useCallback(async (text: string, emotion: string = 'neutral') => {
    try {
      // Stop any current speech
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
        visemeIntervalRef.current = null;
      }

      setIsSpeaking(true);

      // Generate audio with ElevenLabs
      const audioStream = await elevenlabs.textToSpeech.convert(
        'JBFqnCBsd6RMkjVDRZzb', // voice_id
        {
          text: text,
          modelId: 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128',
        }
      );

      // Convert stream to blob
      const chunks: Uint8Array[] = [];
      const reader = audioStream.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const audioBlob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      // Simulate visemes based on text timing
      const words = text.split(' ');
      let wordIndex = 0;
      const wordsPerMinute = 160; // Average speech rate
      const msPerWord = (60 * 1000) / wordsPerMinute;

      audioElement.onplay = () => {
        setIsSpeaking(true);
        
        // Start viseme simulation
        visemeIntervalRef.current = setInterval(() => {
          if (wordIndex < words.length) {
            const word = words[wordIndex];
            const viseme = mapWordToViseme(word);
            setVisemeState(viseme);
            
            // Decay viseme after short duration
            setTimeout(() => {
              setVisemeState(prev => ({ ...prev, intensity: prev.intensity * 0.3 }));
            }, 120);
            
            wordIndex++;
          } else {
            // Speech finished
            if (visemeIntervalRef.current) {
              clearInterval(visemeIntervalRef.current);
              visemeIntervalRef.current = null;
            }
          }
        }, msPerWord);
      };

      audioElement.onended = () => {
        setIsSpeaking(false);
        setVisemeState({ type: 'viseme_closed', intensity: 0 });
        if (visemeIntervalRef.current) {
          clearInterval(visemeIntervalRef.current);
          visemeIntervalRef.current = null;
        }
        URL.revokeObjectURL(audioUrl);
      };

      audioElement.onerror = () => {
        console.error('Error playing ElevenLabs audio');
        setIsSpeaking(false);
        setVisemeState({ type: 'viseme_closed', intensity: 0 });
        if (visemeIntervalRef.current) {
          clearInterval(visemeIntervalRef.current);
          visemeIntervalRef.current = null;
        }
      };

      // Play the audio
      await audioElement.play();

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      setVisemeState({ type: 'viseme_closed', intensity: 0 });
      
      // Fallback to browser TTS if ElevenLabs fails
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setIsSpeaking(false);
          setVisemeState({ type: 'viseme_closed', intensity: 0 });
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  }, []);
  
  const stopSpeaking = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
      visemeIntervalRef.current = null;
    }
    
    // Also stop browser TTS as fallback
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
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
