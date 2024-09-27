import { Button } from '@/components/ui/button'
import { Category } from '@/lib/types'

interface JeopardyBoardProps {
  categories: Category[];
  selectQuestion: (categoryIndex: number, questionIndex: number) => void;
}

export function JeopardyBoard({ categories, selectQuestion }: JeopardyBoardProps) {
  return (
    <div className="grid gap-0 border border-black grid-cols-5 mb-4">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="bg-blue-800 p-0 border border-black">
          <h2 className="text-2xl font-bold py-4 text-center border-b border-black" style={{ fontFamily: 'Impact, sans-serif' }}>
            {category.name.toUpperCase()}
          </h2>
          {category.questions.map((question, questionIndex) => (
            question.question &&
            <Button
              key={questionIndex}
              onClick={() => selectQuestion(categoryIndex, questionIndex)}
              className={`w-full h-24 rounded-none ${
                question.completed ? 'bg-blue-950' : 'bg-blue-800'
              } hover:bg-blue-700 transition-colors duration-200 border border-black`}
              style={{ fontFamily: 'Impact, sans-serif' }}
              disabled={question.completed}
            >
              <span className="text-4xl font-bold text-yellow-400">
                ${question.points || '???'}
              </span>
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}