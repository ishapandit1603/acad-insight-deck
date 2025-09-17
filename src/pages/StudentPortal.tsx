import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  TrendingUp, 
  UserCheck, 
  Volume2,
  GraduationCap,
  FileText,
  ChevronRight,
  Play,
  Pause,
  Phone,
  Mail,
  MapPin,
  Award,
  Square,
  Headphones
} from 'lucide-react';
import {
  students,
  subjects,
  attendanceRecords,
  reminders,
  progressRecords,
  faculty,
  studyContent,
  type Student,
  type ProgressRecord
} from '@/data/mockData';

const StudentPortal = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Calculate progress chart data for selected student
  const getProgressData = (studentId: string) => {
    const studentProgress = progressRecords.filter(record => record.studentId === studentId);
    return studentProgress.map(record => ({
      subject: record.subjectName.split(' ').slice(0, 2).join(' '),
      score: record.score,
      maxScore: record.maxScore,
      percentage: Math.round((record.score / record.maxScore) * 100)
    }));
  };

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(record => record.status === 'present').length;
    const absent = attendanceRecords.filter(record => record.status === 'absent').length;
    const late = attendanceRecords.filter(record => record.status === 'late').length;
    
    return [
      { name: 'Present', value: present, color: '#0891b2' },
      { name: 'Absent', value: absent, color: '#ef4444' },
      { name: 'Late', value: late, color: '#f59e0b' }
    ];
  };

  const playAudio = (content: any) => {
    if (!speechSynthesis) return;

    if (isPlaying === content.id) {
      speechSynthesis.cancel();
      setIsPlaying(null);
      setCurrentContent(null);
      return;
    }

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(content.transcript);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setIsPlaying(content.id);
      setCurrentContent(content);
    };
    
    utterance.onend = () => {
      setIsPlaying(null);
      setCurrentContent(null);
    };
    
    utterance.onerror = () => {
      setIsPlaying(null);
      setCurrentContent(null);
    };

    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(null);
      setCurrentContent(null);
    }
  };

  const navigationCards = [
    {
      id: 'students',
      title: 'Student Records',
      description: 'View and manage student information',
      icon: Users,
      count: students.length,
      gradient: 'bg-gradient-erp'
    },
    {
      id: 'subjects',
      title: 'Subjects',
      description: 'Course catalog and details',
      icon: BookOpen,
      count: subjects.length,
      gradient: 'bg-gradient-erp-secondary'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Track student attendance records',
      icon: UserCheck,
      count: attendanceRecords.length,
      gradient: 'bg-gradient-erp'
    },
    {
      id: 'reminders',
      title: 'Reminders',
      description: 'Important dates and deadlines',
      icon: Bell,
      count: reminders.length,
      gradient: 'bg-gradient-erp-secondary'
    },
    {
      id: 'progress',
      title: 'Progress Records',
      description: 'Academic performance tracking',
      icon: TrendingUp,
      count: progressRecords.length,
      gradient: 'bg-gradient-erp'
    },
    {
      id: 'faculty',
      title: 'Faculty Directory',
      description: 'Faculty information and contacts',
      icon: GraduationCap,
      count: faculty.length,
      gradient: 'bg-gradient-erp-secondary'
    },
    {
      id: 'study-content',
      title: 'Study Content',
      description: 'Audio lectures and materials',
      icon: Volume2,
      count: studyContent.length,
      gradient: 'bg-gradient-erp'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'subjects':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Subjects</h2>
              <p className="text-erp-gray-500">Course catalog and subject information</p>
            </div>
            
            <div className="grid gap-4">
              {subjects.map((subject) => (
                <Card key={subject.id} className="shadow-erp-card hover:shadow-erp transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-erp-navy">{subject.name}</h3>
                          <Badge variant="outline" className="border-erp-cyan text-erp-cyan">
                            {subject.code}
                          </Badge>
                        </div>
                        <p className="text-sm text-erp-gray-500">Instructor: {subject.instructor}</p>
                        <div className="flex items-center gap-4 text-sm text-erp-gray-500">
                          <span>Credits: {subject.credits}</span>
                          <span>Department: {subject.department}</span>
                          <span>Semester: {subject.semester}</span>
                        </div>
                      </div>
                      <BookOpen className="w-8 h-8 text-erp-cyan" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Attendance Records</h2>
              <p className="text-erp-gray-500">Student attendance tracking and statistics</p>
            </div>
            
            <Card className="shadow-erp-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-erp-gray-50">
                      <TableHead className="font-semibold text-erp-navy">Student</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Subject</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Date</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-erp-gray-50 transition-colors">
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.subjectName}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === 'present' ? "default" : "destructive"}
                            className={
                              record.status === 'present' ? "bg-erp-cyan" :
                              record.status === 'late' ? "bg-yellow-500" : ""
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'reminders':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Reminders</h2>
              <p className="text-erp-gray-500">Important dates and upcoming events</p>
            </div>
            
            <div className="grid gap-4">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className="shadow-erp-card hover:shadow-erp transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        reminder.priority === 'high' ? 'bg-red-500' :
                        reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-erp-navy">{reminder.title}</h3>
                          <Badge variant="outline" className="border-erp-cyan text-erp-cyan">
                            {reminder.type}
                          </Badge>
                        </div>
                        <p className="text-erp-gray-500 mt-1">{reminder.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-erp-cyan" />
                          <span className="text-sm text-erp-gray-500">{reminder.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Progress Records</h2>
              <p className="text-erp-gray-500">Academic performance and assessment scores</p>
            </div>
            
            <Card className="shadow-erp-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-erp-gray-50">
                      <TableHead className="font-semibold text-erp-navy">Student</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Subject</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Assessment</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Score</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Percentage</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-erp-gray-50 transition-colors">
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.subjectName}</TableCell>
                        <TableCell>{record.assessmentType}</TableCell>
                        <TableCell>{record.score}/{record.maxScore}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-erp-gray-100 rounded-full h-2">
                              <div 
                                className="bg-erp-cyan h-2 rounded-full transition-all"
                                style={{ width: `${Math.round((record.score / record.maxScore) * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round((record.score / record.maxScore) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'faculty':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Faculty Directory</h2>
              <p className="text-erp-gray-500">Faculty members and contact information</p>
            </div>
            
            <div className="grid gap-4">
              {faculty.map((member) => (
                <Card key={member.id} className="shadow-erp-card hover:shadow-erp transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-erp-navy">{member.name}</h3>
                          <p className="text-sm text-erp-cyan">{member.designation}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-erp-gray-500" />
                            <span className="text-sm text-erp-gray-500">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-erp-gray-500" />
                            <span className="text-sm text-erp-gray-500">{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-erp-gray-500" />
                            <span className="text-sm text-erp-gray-500">
                              Subjects: {member.subjects.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-erp-cyan text-erp-cyan">
                        {member.department}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-erp-navy">Student Records</h2>
                <p className="text-erp-gray-500">Click on any student to view detailed information</p>
              </div>
            </div>
            
            <Card className="shadow-erp-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-erp-gray-50">
                      <TableHead className="font-semibold text-erp-navy">Roll No</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Name</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Department</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Semester</TableHead>
                      <TableHead className="font-semibold text-erp-navy">GPA</TableHead>
                      <TableHead className="font-semibold text-erp-navy">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} className="hover:bg-erp-gray-50 transition-colors">
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-erp-cyan text-erp-cyan">
                            Semester {student.semester}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.gpa >= 3.5 ? "default" : "secondary"} className={student.gpa >= 3.5 ? "bg-erp-cyan" : ""}>
                            {student.gpa}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="erp-outline" 
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                              >
                                View Details <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-erp-navy">Student Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {student.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-6 mt-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-erp-navy mb-2">Personal Information</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-erp-cyan" />
                                        <span className="text-sm">{student.rollNo}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-erp-cyan" />
                                        <span className="text-sm">{student.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-erp-cyan" />
                                        <span className="text-sm">{student.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-erp-cyan" />
                                        <span className="text-sm">{student.address}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-erp-navy mb-2">Academic Information</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-erp-gray-500">Department:</span>
                                        <span className="text-sm font-medium">{student.department}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-erp-gray-500">Semester:</span>
                                        <span className="text-sm font-medium">{student.semester}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-erp-gray-500">GPA:</span>
                                        <span className="text-sm font-medium">{student.gpa}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-erp-gray-500">Enrolled:</span>
                                        <span className="text-sm font-medium">{student.enrollmentDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedStudent && (
                                <div className="mt-6">
                                  <h4 className="font-semibold text-erp-navy mb-4">Performance Progress</h4>
                                  <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={getProgressData(selectedStudent.id)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="subject" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="percentage" fill="hsl(var(--erp-cyan))" radius={[4, 4, 0, 0]} />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'study-content':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Study Content (Audio Available)</h2>
              <p className="text-erp-gray-500">Listen to lectures and study materials with AI-powered speech</p>
            </div>
            
            {/* Now Playing Section */}
            {currentContent && isPlaying && (
              <Card className="border-erp-cyan/30 bg-gradient-to-br from-white to-erp-cyan/5 shadow-erp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-erp-navy">🎵 Now Playing:</h4>
                    <Button 
                      variant="erp-outline" 
                      size="sm" 
                      onClick={stopAudio}
                      className="hover:bg-erp-red/10 hover:border-erp-red hover:text-erp-red"
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-erp-navy mb-3">{currentContent.title}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-erp-cyan rounded-full animate-pulse"
                          style={{ 
                            height: `${8 + (i % 3) * 6}px`,
                            animationDelay: `${i * 0.15}s` 
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-erp-gray-500">Audio playing - {currentContent.duration}</span>
                    <Headphones className="h-4 w-4 text-erp-cyan" />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-6">
              {studyContent.map((content) => (
                <Card key={content.id} className="shadow-erp-card hover:shadow-erp transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className="border-erp-cyan text-erp-cyan bg-erp-cyan/10"
                          >
                            {content.type}
                          </Badge>
                          <span className="text-xs text-erp-gray-500">⏱️ {content.duration}</span>
                          <Volume2 className="h-4 w-4 text-erp-cyan" />
                        </div>
                        <CardTitle className="text-erp-navy mb-1">{content.title}</CardTitle>
                        <CardDescription className="text-erp-gray-500">{content.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant={isPlaying === content.id ? "erp" : "erp-outline"}
                            size="sm"
                            onClick={() => playAudio(content)}
                            className={`transition-all duration-200 ${isPlaying === content.id ? 
                              "animate-pulse-glow shadow-lg" : 
                              "hover:shadow-md hover:scale-105"
                            }`}
                          >
                            {isPlaying === content.id ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Audio
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Listen Now
                              </>
                            )}
                          </Button>
                          
                          {content.audioUrl && (
                            <Badge variant="secondary" className="bg-erp-gray-100 text-erp-navy">
                              🎵 MP3 Available
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-erp-gray-500">Subject: {subjects.find(s => s.id === content.subjectId)?.name}</p>
                          <p className="text-xs text-erp-gray-500">Uploaded: {new Date(content.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="bg-erp-gray-50 p-4 rounded-lg border-l-4 border-erp-cyan">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-erp-navy flex items-center gap-2">
                            📄 Transcript 
                            {isPlaying === content.id && <span className="text-xs bg-erp-cyan text-white px-2 py-1 rounded">PLAYING</span>}
                          </h4>
                        </div>
                        <p className="text-sm text-erp-gray-600 leading-relaxed">
                          {isPlaying === content.id ? content.transcript : `${content.transcript.substring(0, 150)}...`}
                        </p>
                        {isPlaying !== content.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-erp-cyan hover:bg-erp-cyan/10"
                            onClick={() => playAudio(content)}
                          >
                            Click to read full transcript with audio
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Audio Learning Features */}
            <Card className="bg-gradient-to-r from-erp-cyan/10 to-erp-navy/10 border-erp-cyan/20 shadow-erp">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-erp-navy mb-2 flex items-center gap-2">
                      🎧 Enhanced Audio Learning Features
                    </h4>
                    <ul className="text-sm text-erp-gray-600 space-y-1">
                      <li>• AI-powered text-to-speech conversion</li>
                      <li>• Full transcript reading during playback</li>
                      <li>• Hands-free learning experience</li>
                      <li>• Multiple subject support</li>
                    </ul>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <Headphones className="h-12 w-12 text-erp-cyan mx-auto mb-1" />
                      <p className="text-xs text-erp-gray-500">Listen & Learn</p>
                    </div>
                    <div className="text-center">
                      <Volume2 className="h-10 w-10 text-erp-navy/70 mx-auto mb-1" />
                      <p className="text-xs text-erp-gray-500">Audio Ready</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-erp-navy">Learning Assistant Portal</h2>
              <p className="text-erp-gray-500">Student Database & ERP Management System</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-erp text-white shadow-erp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Total Students</p>
                      <p className="text-2xl font-bold">{students.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-erp-secondary text-white shadow-erp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Active Subjects</p>
                      <p className="text-2xl font-bold">{subjects.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-erp-navy text-white shadow-erp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Faculty Members</p>
                      <p className="text-2xl font-bold">{faculty.length}</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-erp-cyan text-white shadow-erp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Study Materials</p>
                      <p className="text-2xl font-bold">{studyContent.length}</p>
                    </div>
                    <Volume2 className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {navigationCards.slice(0, 4).map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.id} className="hover:shadow-erp transition-all duration-200 hover:scale-105 cursor-pointer shadow-erp-card" onClick={() => setActiveSection(card.id)}>
                    <CardContent className="p-6">
                      <div className={`${card.gradient} text-white p-3 rounded-lg mb-4 w-fit`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-erp-navy mb-2">{card.title}</h3>
                      <p className="text-sm text-erp-gray-500 mb-3">{card.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-erp-gray-100 text-erp-navy">
                          {card.count} records
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-erp-cyan" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-erp-card">
                <CardHeader>
                  <CardTitle className="text-erp-navy">Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getAttendanceStats()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}`}
                        >
                          {getAttendanceStats().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-erp-card">
                <CardHeader>
                  <CardTitle className="text-erp-navy">Recent Reminders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reminders.slice(0, 4).map((reminder) => (
                    <div key={reminder.id} className="flex items-start gap-3 p-3 bg-erp-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        reminder.priority === 'high' ? 'bg-red-500' :
                        reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-erp-navy">{reminder.title}</h4>
                        <p className="text-sm text-erp-gray-500">{reminder.description}</p>
                        <p className="text-xs text-erp-gray-500 mt-1">{reminder.date}</p>
                      </div>
                      <Badge variant="outline" className="border-erp-cyan text-erp-cyan">
                        {reminder.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b border-erp-gray-100 shadow-erp-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-erp rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-erp-navy">Smart Learn</h1>
                <p className="text-xs text-erp-gray-500">Learning Assistant System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {navigationCards.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "erp" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(item.id)}
                  className="text-sm"
                >
                  {item.title}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentPortal;