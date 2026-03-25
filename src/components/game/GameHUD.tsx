'use client'

import { useGameStore } from '@/store/game-store'
import { Heart, Star, Trophy, Zap } from 'lucide-react'

export function GameHUD() {
  const { score, lives, level, chaosLevel, obeyCount, disobeyCount, randomCount, highScore } = useGameStore()
  
  const totalActions = obeyCount + disobeyCount + randomCount
  const obedienceRate = totalActions > 0 ? Math.round((obeyCount / totalActions) * 100) : 0
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Top row */}
      <div className="flex justify-between items-center mb-2 px-2">
        {/* Lives */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        
        {/* Level */}
        <div className="bg-amber-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow-md">
          Level {level}
        </div>
        
        {/* Score */}
        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-amber-800">{score}</span>
        </div>
      </div>
      
      {/* Chaos meter */}
      <div className="px-2 mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-medium text-purple-700">CHAOS</span>
          <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
              style={{ width: `${chaosLevel}%` }}
            />
          </div>
          <span className="text-xs font-bold text-purple-700">{Math.round(chaosLevel)}%</span>
        </div>
      </div>
      
      {/* Stats row */}
      {totalActions > 0 && (
        <div className="flex justify-center gap-4 text-xs text-amber-700 mb-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {obedienceRate}% obedient
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {disobeyCount} rebel
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            {randomCount} chaos
          </span>
        </div>
      )}
      
      {/* High score */}
      {highScore > 0 && (
        <div className="text-center text-xs text-amber-600">
          <Trophy className="w-3 h-3 inline mr-1" />
          High Score: {highScore}
        </div>
      )}
    </div>
  )
}
