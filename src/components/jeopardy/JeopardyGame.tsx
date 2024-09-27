'use client'

import { useState } from 'react'
import { JeopardyBoard } from '@/components/jeopardy/JeopardyBoard'
import { JeopardyQuestion } from '@/components/jeopardy/JeopardyQuestion'
import { JeopardySetup } from '@/components/jeopardy/JeopardySetup'
import { JeopardyTeam } from '@/components/jeopardy/JeopardyTeam'
import { Button } from '@/components/ui/button'
import { Category, Question, Team } from '@/lib/types'

export function JeopardyGame() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 }
  ])
  const [isSetupMode, setIsSetupMode] = useState(true)

  const selectQuestion = (categoryIndex: number, questionIndex: number) => {
    if (!isSetupMode) {
      setCurrentQuestion(categories[categoryIndex].questions[questionIndex])
      setCurrentCategoryIndex(categoryIndex)
      setCurrentQuestionIndex(questionIndex)
    }
  }

  const markQuestionCompleted = () => {
    if (currentCategoryIndex !== null && currentQuestionIndex !== null) {
      const newCategories = [...categories]
      newCategories[currentCategoryIndex].questions[currentQuestionIndex].completed = true
      setCategories(newCategories)
    }
    setCurrentQuestion(null)
    setCurrentCategoryIndex(null)
    setCurrentQuestionIndex(null)
  }

  const updateScore = (teamIndex: number, points: number) => {
    const newTeams = [...teams]
    newTeams[teamIndex].score += points
    setTeams(newTeams)
    markQuestionCompleted()
  }

  const adjustScore = (teamIndex: number, amount: number) => {
    const newTeams = [...teams]
    newTeams[teamIndex].score = Math.max(0, newTeams[teamIndex].score + amount)
    setTeams(newTeams)
  }

  const resetBoard = () => {
    setTeams(teams.map(team => ({ ...team, score: 0 })));

    const resetCategories = categories.map(category => ({
      ...category,
      questions: category.questions.map(question => ({
        ...question,
        completed: false
      }))
    }))
    setCategories(resetCategories)
  }

  const switchMode = () => {
    setIsSetupMode(!isSetupMode)
    setCurrentQuestion(null)
    setCurrentCategoryIndex(null)
    setCurrentQuestionIndex(null)
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Jeopardy Game</h1>
      <Button 
        onClick={switchMode} 
        className={`mb-4 ${isSetupMode ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
      >
        {isSetupMode ? 'Switch to Play Mode' : 'Switch to Setup Mode'}
      </Button>

      {isSetupMode ? (
        <JeopardySetup
          categories={categories}
          setCategories={setCategories}
          teams={teams}
          setTeams={setTeams}
          resetBoard={resetBoard}
        />
      ) : (
        <>
          <JeopardyBoard
            categories={categories}
            selectQuestion={selectQuestion}
          />
          {currentQuestion && (
            <JeopardyQuestion
              currentQuestion={currentQuestion}
              teams={teams}
              onUpdateScore={updateScore}
              onMarkQuestionCompleted={markQuestionCompleted}
            />
          )}
          <div className="flex flex-wrap justify-between text-2xl mt-4">
            {teams.map((team, index) => (
              <JeopardyTeam
                key={index}
                team={team}
                index={index}
                onAdjustScore={adjustScore}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}