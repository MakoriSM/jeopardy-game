import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Question, Team } from '@/lib/types'

interface JeopardyQuestionProps {
  currentQuestion: Question;
  teams: Team[];
  onUpdateScore: (teamIndex: number, points: number) => void;
  onMarkQuestionCompleted: () => void;
}

export function JeopardyQuestion({
  currentQuestion,
  teams,
  onUpdateScore,
  onMarkQuestionCompleted
}: JeopardyQuestionProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setShowAnswer(!showAnswer)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [showAnswer])

  return (
    <div className="fixed inset-0 bg-blue-900 flex items-center justify-center">
      <Card className="w-3/4 h-3/4 bg-blue-800 text-white p-8 flex flex-col justify-between border-4 border-white">
        <div className="text-4xl font-bold mb-4 text-center" style={{ fontFamily: 'Impact, sans-serif' }}>
          {showAnswer ? 'ANSWER:' : 'QUESTION:'}
        </div>
        <div className="text-6xl font-bold text-center flex-grow flex items-center justify-center" style={{ fontFamily: 'Impact, sans-serif' }}>
          {showAnswer ? currentQuestion.answer.toUpperCase() : currentQuestion.question.toUpperCase()}
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={onMarkQuestionCompleted} className="mr-2">Back to Board</Button>
          <div className="text-2xl">Points: ${currentQuestion.points}</div>
          <div className="flex space-x-2">
            {teams.map((team, index) => (
              <Button key={index} onClick={() => onUpdateScore(index, currentQuestion.points)}>
                {team.name} Correct
              </Button>
            ))} 
          </div>
        </div>
      </Card>
    </div>
  )
}