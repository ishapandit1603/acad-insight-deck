import { progressRecords, studyContent } from '@/data/mockData';

export interface WeakArea {
  topic: string;
  subject: string;
  averageScore: number;
  recommendedContent: string[];
}

export interface StudyRecommendation {
  message: string;
  contentItems: Array<{
    title: string;
    subject: string;
    content: string;
  }>;
}

export const analyzePerformance = (studentId: string): WeakArea[] => {
  const studentRecords = progressRecords.filter(record => record.studentId === studentId);
  
  // Group by subject and calculate averages
  const subjectScores: { [key: string]: { scores: number[], total: number } } = {};
  
  studentRecords.forEach(record => {
    const key = record.subjectName;
    if (!subjectScores[key]) {
      subjectScores[key] = { scores: [], total: 0 };
    }
    subjectScores[key].scores.push((record.score / record.maxScore) * 100);
    subjectScores[key].total++;
  });

  // Identify weak areas (below 75% average)
  const weakAreas: WeakArea[] = [];
  
  Object.entries(subjectScores).forEach(([subject, data]) => {
    const average = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    
    if (average < 75) {
      // Map subjects to relevant study topics
      const topicMapping: { [key: string]: string[] } = {
        'Artificial Intelligence and Machine Learning': [
          'Neural Networks Fundamentals',
          'Machine Learning Algorithms',
          'Deep Learning Concepts',
          'Introduction to Binary Trees'
        ],
        'Data Structures and Algorithms': [
          'Introduction to Binary Trees',
          'Graph Algorithms',
          'Dynamic Programming'
        ],
        'Database Management Systems': [
          'SQL Fundamentals',
          'Database Design'
        ]
      };

      const relatedContent = topicMapping[subject] || [];
      
      weakAreas.push({
        topic: subject,
        subject: subject,
        averageScore: average,
        recommendedContent: relatedContent
      });
    }
  });

  return weakAreas;
};

export const getStudyRecommendation = (studentId: string): StudyRecommendation | null => {
  const weakAreas = analyzePerformance(studentId);
  
  if (weakAreas.length === 0) {
    return null;
  }

  const primaryWeak = weakAreas[0]; // Focus on the weakest area
  const recommendedItems = studyContent.filter(content => 
    primaryWeak.recommendedContent.some(topic => 
      content.title.toLowerCase().includes(topic.toLowerCase())
    )
  );

  return {
    message: `Based on your recent performance (${primaryWeak.averageScore.toFixed(1)}% average), I recommend focusing on ${primaryWeak.topic}. Here are some materials to help you improve:`,
    contentItems: recommendedItems.map(item => ({
      title: item.title,
      subject: primaryWeak.subject,
      content: item.transcript
    }))
  };
};