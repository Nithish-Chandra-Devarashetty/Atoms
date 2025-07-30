export interface VideoData {
  title: string;
  url: string;
  duration: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface SubjectData {
  videos: VideoData[];
  quiz: QuizQuestion[];
}

export const parseSubjectData = (content: string): SubjectData => {
  const lines = content.split('\n').filter(line => line.trim());
  const videos: VideoData[] = [];
  const quiz: QuizQuestion[] = [];
  
  let currentSection = '';
  let currentQuestion: Partial<QuizQuestion> = {};
  let optionIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for YouTube URL
    if (line.includes('youtube.com') || line.includes('youtu.be')) {
      videos.push({
        title: `${currentSection} - Video Tutorial`,
        url: line,
        duration: '15:30' // Default duration
      });
      continue;
    }

    // Check for quiz questions (lines starting with ####)
    if (line.startsWith('####')) {
      // Save previous question if exists
      if (currentQuestion.question && currentQuestion.options && currentQuestion.correct !== undefined) {
        quiz.push(currentQuestion as QuizQuestion);
      }
      
      // Start new question
      currentQuestion = {
        question: line.replace(/^####\s*\d+\.\s*/, ''),
        options: [],
        correct: 0
      };
      optionIndex = 0;
      continue;
    }

    // Check for options (lines starting with - a), - b), etc.)
    if (line.match(/^-\s*[a-d]\)/)) {
      if (currentQuestion.options) {
        const optionText = line.replace(/^-\s*[a-d]\)\s*/, '');
        const isCorrect = optionText.includes('✔️');
        const cleanOption = optionText.replace('✔️', '').trim();
        
        currentQuestion.options.push(cleanOption);
        
        if (isCorrect) {
          currentQuestion.correct = optionIndex;
        }
        
        optionIndex++;
      }
      continue;
    }

    // Set section headers
    if (line.toLowerCase().includes('quiz') || line.toLowerCase().includes('questions')) {
      currentSection = line;
    }
  }

  // Add the last question if exists
  if (currentQuestion.question && currentQuestion.options && currentQuestion.correct !== undefined) {
    quiz.push(currentQuestion as QuizQuestion);
  }

  return { videos, quiz };
};

export const parseCSVData = (csvContent: string) => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index].trim();
      });
      data.push(row);
    }
  }

  return data;
};