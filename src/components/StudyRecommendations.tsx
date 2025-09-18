import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingDown, Volume2 } from 'lucide-react';
import { getStudyRecommendation, analyzePerformance } from '@/utils/performanceAnalyzer';

interface StudyRecommendationsProps {
  studentId: string;
  onReadContent: (content: string) => void;
}

export const StudyRecommendations = ({ studentId, onReadContent }: StudyRecommendationsProps) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);

  useEffect(() => {
    const rec = getStudyRecommendation(studentId);
    const areas = analyzePerformance(studentId);
    setRecommendation(rec);
    setWeakAreas(areas);
  }, [studentId]);

  if (!recommendation && weakAreas.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <BookOpen className="h-5 w-5" />
            Excellent Performance!
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            You're performing well across all subjects. Keep up the great work!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {weakAreas.length > 0 && (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <TrendingDown className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
            <CardDescription className="text-amber-600 dark:text-amber-400">
              Based on your recent quiz and exam performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <div>
                  <h4 className="font-medium">{area.topic}</h4>
                  <p className="text-sm text-muted-foreground">
                    Average Score: {area.averageScore.toFixed(1)}%
                  </p>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Focus Area
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recommendation && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <BookOpen className="h-5 w-5" />
              Recommended Study Materials
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              {recommendation.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendation.contentItems.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <Badge variant="outline" className="mb-2">{item.subject}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.content.substring(0, 150)}...
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-3 shrink-0"
                    onClick={() => onReadContent(`${item.title}. ${item.content}`)}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Voice Tip:</strong> Say "Read [content title]" or "Recommend" to get personalized study suggestions read aloud!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};