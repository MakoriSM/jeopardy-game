import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Category, Team, Question } from '@/lib/types'
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea'

interface JeopardySetupProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  resetBoard: () => void;
}

export function JeopardySetup({
  categories,
  setCategories,
  teams,
  setTeams,
  resetBoard
}: JeopardySetupProps) {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const addCategory = () => {
    if (categories.length < 10) {
      setCategories([...categories, { 
        name: `Category ${categories.length + 1}`, 
        questions: Array(5).fill(null).map((_, index) => ({
          question: '',
          answer: '',
          points: (index + 1) * 200,
          completed: false
        }))
      }])
    }
  }

  const updateCategoryName = (index: number, name: string) => {
    const newCategories = [...categories]
    newCategories[index].name = name
    setCategories(newCategories)
  }

  const removeCategory = (index: number) => {
    const newCategories = [...categories]
    newCategories.splice(index, 1)
    setCategories(newCategories)
  }

  const addQuestion = (categoryIndex: number) => {
    if (categories[categoryIndex].questions.length < 10) {
      const newCategories = [...categories]
      const newQuestionIndex = newCategories[categoryIndex].questions.length
      newCategories[categoryIndex].questions.push({
        question: '',
        answer: '',
        points: (newQuestionIndex + 1) * 200,
        completed: false
      })
      setCategories(newCategories)
    }
  }

  const updateQuestion = (categoryIndex: number, questionIndex: number, field: keyof Question, value: string | number) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const question = { ...newCategories[categoryIndex].questions[questionIndex] };
      
      switch (field) {
        case 'question':
        case 'answer':
          if (typeof value === 'string') {
            question[field] = value;
          }
          break;
        case 'points':
          if (typeof value === 'number') {
            question.points = value;
          }
          break;
        case 'completed':
          if (typeof value === 'boolean') {
            question.completed = value;
          }
          break;
      }

      newCategories[categoryIndex].questions[questionIndex] = question;
      return newCategories;
    });
  }

  const removeQuestion = (categoryIndex: number, questionIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].questions.splice(questionIndex, 1)
    setCategories(newCategories)
  }

  const addTeam = () => {
    if (teams.length < 5) {
      setTeams([...teams, { name: `Team ${teams.length + 1}`, score: 0 }])
    }
  }

  const removeTeam = (index: number) => {
    const newTeams = [...teams]
    newTeams.splice(index, 1)
    setTeams(newTeams)
  }

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams]
    newTeams[index].name = name
    setTeams(newTeams)
  }

  const exportQuestions = () => {
    let csv = 'Category,Question,Answer,Points\n'
    categories.forEach(category => {
      category.questions.forEach(question => {
        if (question.question) {
          csv += `"${category.name}","${question.question}","${question.answer}",${question.points}\n`
        }
      })
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'jeopardy_questions.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const importQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split('\n')
        const newCategories: Category[] = []
        lines.slice(1).forEach(line => {
          if (line.trim()) {
            const [categoryName, question, answer, points] = parseCSVLine(line)
            let category = newCategories.find(c => c.name === categoryName)
            if (!category) {
              if (newCategories.length < 10) {
                category = { name: categoryName, questions: [] }
                newCategories.push(category)
              } else {
                return // Skip if we've reached the maximum number of categories
              }
            }
            if (category.questions.length < 10) {
              category.questions.push({
                question: question || "Question not found",
                answer: answer || "Answer not found",
                points: points ? parseInt(points) : 0,
                completed: false
              })
            }
          }
        })
        setCategories(newCategories)
      }
      reader.readAsText(file)
    }
  }

  const parseCSVLine = (line: string): [string, string, string, string] => {
    const result: string[] = []
    let startIndex = 0
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes
      } else if (line[i] === ',' && !inQuotes) {
        result.push(line.slice(startIndex, i).replace(/^"|"$/g, '').replace(/""/g, '"'))
        startIndex = i + 1
      }
    }
    result.push(line.slice(startIndex).replace(/^"|"$/g, '').replace(/""/g, '"'))

    return [
      result[0] || "Category not found",
      result[1] || "Question not found",
      result[2] || "Answer not found",
      result[3] || "???"
    ]
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button onClick={addCategory} disabled={categories.length >= 10}>Add Category</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600">
                Restart Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to restart the game?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will reset all questions to their initial state and set all team scores to zero. Categories and questions will not be deleted. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetBoard}>
                  Reset Board and Scores
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div>
          <Button onClick={exportQuestions} className="mr-2">Export Questions</Button>
          <Input
            type="file"
            accept=".csv"
            onChange={importQuestions}
            className="hidden"
            id="csvInput"
          />
          <Button onClick={() => document.getElementById('csvInput')?.click()}>
            Import Questions
          </Button>
        </div>
      </div>

      <div className="grid gap-1 grid-cols-5 mb-4">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-blue-800 p-2">
            <Input
              value={category.name}
              onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
              placeholder="Category Name"
              className="bg-blue-700 text-white mb-2"
            />
            {category.questions.map((question, questionIndex) => (
              <Dialog key={`${categoryIndex}-${questionIndex}`} open={openDialogId === `${categoryIndex}-${questionIndex}`} onOpenChange={(open) => setOpenDialogId(open ? `${categoryIndex}-${questionIndex}` : null)}>
                <DialogTrigger asChild>
                  <Button
                    className={`w-full mb-1 h-20 ${
                      question.completed ? 'bg-blue-950' : 'bg-blue-800'
                    } hover:bg-blue-700 transition-colors duration-200 border border-black`}
                    style={{ fontFamily: 'Impact, sans-serif' }}
                  >
                    <span className="text-4xl font-bold text-yellow-400">
                      ${question.points || '???'}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-blue-900 text-white">
                  <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <label htmlFor={`question-${categoryIndex}-${questionIndex}`} className="block text-sm font-medium mb-1">Question</label>
                    <Textarea
                      id={`question-${categoryIndex}-${questionIndex}`}
                      value={question.question}
                      onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'question', e.target.value)}
                      placeholder="Question"
                      className="bg-blue-800 text-white h-32 resize-none"
                    />
                  <div>
                    <label htmlFor={`answer-${categoryIndex}-${questionIndex}`} className="block text-sm font-medium mb-1">Answer</label>
                    <Textarea
                      id={`answer-${categoryIndex}-${questionIndex}`}
                      value={question.answer}
                      onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'answer', e.target.value)}
                      placeholder="Answer"
                      className="bg-blue-800 text-white h-32 resize-none"
                    />
                  </div>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(categoryIndex, questionIndex, 'points', parseInt(e.target.value))}
                      placeholder="Points"
                      className="bg-blue-800 text-white"
                    />
                    <Button onClick={() => removeQuestion(categoryIndex, questionIndex)} variant="destructive">
                      Remove Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            <div>
              <Button 
                onClick={() => addQuestion(categoryIndex)} 
                className="w-full mt-2"
                disabled={category.questions.length >= 10}
              >
                Add Question
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full mt-2">
                    Remove Category
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the category
                      and all its questions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeCategory(categoryIndex)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-2 mt-8">Teams</h2>
      {teams.map((team, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            value={team.name}
            onChange={(e) => updateTeamName(index, e.target.value)}
            placeholder="Team Name"
            className="bg-blue-800 text-white mr-2"
          />
          <Button onClick={() => removeTeam(index)} variant="destructive" size="sm">
            Remove Team
          </Button>
        </div>
      ))}
      <Button onClick={addTeam} disabled={teams.length >= 5} className="mt-2">
        Add Team
      </Button>
    </div>
  )
}