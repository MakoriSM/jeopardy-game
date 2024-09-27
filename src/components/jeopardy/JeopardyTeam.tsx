import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { Team } from '@/lib/types'

interface JeopardyTeamProps {
  team: Team;
  index: number;
  onAdjustScore: (teamIndex: number, amount: number) => void;
}

export function JeopardyTeam({ team, index, onAdjustScore }: JeopardyTeamProps) {
  return (
    <div className="flex items-center mb-4 mr-4 p-2 bg-blue-800 rounded">
      <span className="mr-2">{team.name}: ${team.score}</span>
      <Button onClick={() => onAdjustScore(index, 100)} className="ml-2" size="sm"><Plus className="h-4 w-4" /></Button>
      <Button onClick={() => onAdjustScore(index, -100)} className="ml-2" size="sm"><Minus className="h-4 w-4" /></Button>
    </div>
  )
}