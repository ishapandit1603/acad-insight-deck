export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  semester: number;
  gpa: number;
  phone: string;
  address: string;
  enrollmentDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  department: string;
  semester: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  studentName: string;
  subjectName: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'assignment' | 'exam' | 'event' | 'deadline';
  priority: 'high' | 'medium' | 'low';
}

export interface ProgressRecord {
  id: string;
  studentId: string;
  subjectId: string;
  assessmentType: string;
  score: number;
  maxScore: number;
  date: string;
  studentName: string;
  subjectName: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  subjects: string[];
}

export interface StudyContent {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  type: 'lecture' | 'tutorial' | 'lab' | 'assignment';
  audioUrl?: string;
  transcript: string;
  duration: string;
  uploadDate: string;
}

// Mock Data
export const students: Student[] = [
  {
    id: '1',
    name: 'Aarav Shah',
    rollNo: 'CS21001',
    email: 'aarav.shah@university.edu',
    department: 'Computer Science',
    semester: 6,
    gpa: 3.8,
    phone: '+91 98765 43210',
    address: '123 University Ave, Mumbai, MH 400001',
    enrollmentDate: '2021-08-15'
  },
  {
    id: '2',
    name: 'Kirti Rao',
    rollNo: 'CS21002',
    email: 'kirti.rao@university.edu',
    department: 'Computer Science',
    semester: 6,
    gpa: 3.6,
    phone: '+91 98765 43211',
    address: '456 College Rd, Pune, MH 411001',
    enrollmentDate: '2021-08-15'
  },
  {
    id: '3',
    name: 'Dev Mehta',
    rollNo: 'EE21003',
    email: 'dev.mehta@university.edu',
    department: 'Electrical Engineering',
    semester: 6,
    gpa: 3.9,
    phone: '+91 98765 43212',
    address: '789 Student St, Delhi, DL 110001',
    enrollmentDate: '2021-08-15'
  }
];

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS301',
    credits: 4,
    instructor: 'Dr. Sneha Kapoor',
    department: 'Computer Science',
    semester: 6
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS302',
    credits: 3,
    instructor: 'Prof. Aditya Menon',
    department: 'Computer Science',
    semester: 6
  },
  {
    id: '3',
    name: 'Software Engineering',
    code: 'CS303',
    credits: 4,
    instructor: 'Dr. Sneha Kapoor',
    department: 'Computer Science',
    semester: 6
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS304',
    credits: 3,
    instructor: 'Prof. Aditya Menon',
    department: 'Computer Science',
    semester: 6
  },
  {
    id: '5',
    name: 'Artificial Intelligence and Machine Learning',
    code: 'CS305',
    credits: 4,
    instructor: 'Dr. Sneha Kapoor',
    department: 'Computer Science',
    semester: 6
  }
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    date: '2024-01-15',
    status: 'present',
    studentName: 'Aarav Shah',
    subjectName: 'Data Structures and Algorithms'
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '2',
    date: '2024-01-15',
    status: 'present',
    studentName: 'Aarav Shah',
    subjectName: 'Database Management Systems'
  },
  {
    id: '3',
    studentId: '2',
    subjectId: '1',
    date: '2024-01-15',
    status: 'absent',
    studentName: 'Kirti Rao',
    subjectName: 'Data Structures and Algorithms'
  },
  {
    id: '4',
    studentId: '2',
    subjectId: '2',
    date: '2024-01-15',
    status: 'late',
    studentName: 'Kirti Rao',
    subjectName: 'Database Management Systems'
  }
];

export const reminders: Reminder[] = [
  {
    id: '1',
    title: 'Assignment Submission',
    description: 'Submit Data Structures assignment by 11:59 PM',
    date: '2024-01-20',
    type: 'assignment',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Mid-term Exam',
    description: 'Database Management Systems mid-term exam',
    date: '2024-01-25',
    type: 'exam',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Lab Session',
    description: 'Software Engineering lab session in Room 301',
    date: '2024-01-22',
    type: 'event',
    priority: 'medium'
  }
];

export const progressRecords: ProgressRecord[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    assessmentType: 'Quiz 1',
    score: 85,
    maxScore: 100,
    date: '2024-01-10',
    studentName: 'Aarav Shah',
    subjectName: 'Data Structures and Algorithms'
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '2',
    assessmentType: 'Assignment 1',
    score: 92,
    maxScore: 100,
    date: '2024-01-12',
    studentName: 'Aarav Shah',
    subjectName: 'Database Management Systems'
  },
  {
    id: '3',
    studentId: '2',
    subjectId: '1',
    assessmentType: 'Quiz 1',
    score: 78,
    maxScore: 100,
    date: '2024-01-10',
    studentName: 'Kirti Rao',
    subjectName: 'Data Structures and Algorithms'
  },
  {
    id: '4',
    studentId: '1',
    subjectId: '3',
    assessmentType: 'Project 1',
    score: 88,
    maxScore: 100,
    date: '2024-01-14',
    studentName: 'Aarav Shah',
    subjectName: 'Software Engineering'
  }
];

export const faculty: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Sneha Kapoor',
    email: 'sneha.kapoor@university.edu',
    department: 'Computer Science',
    designation: 'Professor',
    phone: '+91 98765 11111',
    subjects: ['CS301', 'CS305']
  },
  {
    id: '2',
    name: 'Prof. Aditya Menon',
    email: 'aditya.menon@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    phone: '+91 98765 22222',
    subjects: ['CS302', 'CS306']
  }
];

export const studyContent: StudyContent[] = [
  {
    id: '1',
    title: 'Introduction to Binary Trees',
    description: 'Comprehensive lecture on binary tree data structures, traversal methods, and implementation techniques.',
    subjectId: '1',
    type: 'lecture',
    transcript: 'Welcome to the lecture on Binary Trees. A binary tree is a tree data structure where each node has at most two children, which are referred to as the left child and the right child...',
    duration: '45:30',
    uploadDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'SQL Joins and Relationships',
    description: 'Detailed tutorial on SQL joins, foreign keys, and database relationships.',
    subjectId: '2',
    type: 'tutorial',
    transcript: 'In this tutorial, we will explore SQL joins. Joins are used to combine rows from two or more tables based on a related column between them...',
    duration: '32:15',
    uploadDate: '2024-01-12'
  },
  {
    id: '3',
    title: 'Agile Development Methodologies',
    description: 'Overview of Agile software development practices and Scrum framework.',
    subjectId: '3',
    type: 'lecture',
    transcript: 'Agile development is an iterative approach to software development that emphasizes flexibility, collaboration, and customer satisfaction...',
    duration: '38:45',
    uploadDate: '2024-01-14'
  }
];