import { useState, useEffect, useCallback } from 'react';
import { students, subjects, attendanceRecords, reminders, progressRecords, faculty, studyContent } from '@/data/mockData';
import { getStudyRecommendation, analyzePerformance } from '@/utils/performanceAnalyzer';

// Type declarations for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceAssistantOptions {
  onSectionChange: (section: string) => void;
}

export const useVoiceAssistant = ({ onSectionChange }: VoiceAssistantOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          processVoiceCommand(command);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);

    // Check for "read" commands for specific study content
    if (command.includes('read ')) {
      const contentTitle = command.replace('read ', '').trim();
      const matchedContent = studyContent.find(content => 
        content.title.toLowerCase().includes(contentTitle.toLowerCase())
      );
      
      if (matchedContent) {
        speak(`Reading ${matchedContent.title}. ${matchedContent.transcript}`);
        return;
      } else {
        speak(`I could not find content titled "${contentTitle}". Available content includes: ${studyContent.map(c => c.title).join(', ')}`);
        return;
      }
    }

    // Check for performance recommendations
    if (command.includes('recommend') || command.includes('suggestion') || command.includes('help me study')) {
      const recommendation = getStudyRecommendation('1'); // Using student ID 1 as example
      
      if (recommendation) {
        speak(recommendation.message);
        setTimeout(() => {
          const titles = recommendation.contentItems.map(item => item.title).join(', ');
          speak(`I recommend studying: ${titles}. You can say "read" followed by any topic name to hear the content.`);
        }, 3000);
        return;
      } else {
        speak('Great job! Your performance is strong across all subjects. Keep up the excellent work!');
        return;
      }
    }

    // Existing navigation commands
    if (command.includes('open student records') || command.includes('student records')) {
      onSectionChange('students');
      speak('Opening student records. Here are the students:');
      setTimeout(() => {
        const studentNames = students.map(s => `${s.name}, roll number ${s.rollNo}, department ${s.department}, semester ${s.semester}, GPA ${s.gpa}`).join('. ');
        speak(`The students are: ${studentNames}`);
      }, 1000);
    }
    else if (command.includes('open subjects') || command.includes('subjects')) {
      onSectionChange('subjects');
      speak('Opening subjects section. Here are the available subjects:');
      setTimeout(() => {
        const subjectNames = subjects.map(s => `${s.name}, code ${s.code}, taught by ${s.instructor}, ${s.credits} credits`).join('. ');
        speak(`The subjects are: ${subjectNames}`);
      }, 1000);
    }
    else if (command.includes('open attendance') || command.includes('attendance')) {
      onSectionChange('attendance');
      speak('Opening attendance records. Here is the attendance information:');
      setTimeout(() => {
        const attendanceInfo = attendanceRecords.slice(0, 5).map(a => `${a.studentName} was ${a.status} for ${a.subjectName} on ${a.date}`).join('. ');
        speak(`Recent attendance: ${attendanceInfo}`);
      }, 1000);
    }
    else if (command.includes('open reminders') || command.includes('reminders')) {
      onSectionChange('reminders');
      speak('Opening reminders section. Here are the upcoming reminders:');
      setTimeout(() => {
        const reminderInfo = reminders.map(r => `${r.title} on ${r.date}, priority ${r.priority}`).join('. ');
        speak(`Your reminders: ${reminderInfo}`);
      }, 1000);
    }
    else if (command.includes('open progress') || command.includes('progress records')) {
      onSectionChange('progress');
      speak('Opening progress records. Here are the latest assessment results:');
      setTimeout(() => {
        const progressInfo = progressRecords.slice(0, 5).map(p => `${p.studentName} scored ${p.score} out of ${p.maxScore} in ${p.assessmentType} for ${p.subjectName}`).join('. ');
        speak(`Recent progress: ${progressInfo}`);
      }, 1000);
    }
    else if (command.includes('open faculty') || command.includes('faculty directory')) {
      onSectionChange('faculty');
      speak('Opening faculty directory. Here are the faculty members:');
      setTimeout(() => {
        const facultyInfo = faculty.map(f => `${f.name}, ${f.designation}, department ${f.department}, teaching ${f.subjects.join(' and ')}`).join('. ');
        speak(`Faculty members: ${facultyInfo}`);
      }, 1000);
    }
    else if (command.includes('open study content') || command.includes('study content')) {
      onSectionChange('study-content');
      speak('Opening study content section. Here are the available study materials:');
      setTimeout(() => {
        const contentInfo = studyContent.map(c => `${c.title}, ${c.type}, duration ${c.duration}`).join('. ');
        speak(`Study content: ${contentInfo}. You can say "read" followed by any content title to hear it aloud, or say "recommend" for personalized study suggestions.`);
      }, 1000);
    }
    else if (command.includes('stop speaking') || command.includes('stop')) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
    else {
      speak('I did not understand that command. You can say: Open student records, Open subjects, Open study content, Read followed by content title, Recommend for study suggestions, or Stop speaking.');
    }
  }, [onSectionChange, speak]);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    isListening,
    isSpeaking,
    isSupported,
    startListening,
    stopListening,
    stopSpeaking,
    speak
  };
};