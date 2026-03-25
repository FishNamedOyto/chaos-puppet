'use client'

import { useGameStore } from '@/store/game-store'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronRight, Trophy, Skull, PartyPopper } from 'lucide-react'

export function StartScreen() {
  const { startGame, highScore, highScoreLoaded } = useGameStore()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 flex flex-col items-center justify-center p-6 rounded-xl z-10"
    >
      {/* Title */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-5xl mb-2"
      >
        🎭
      </motion.div>
      
      <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
        CHAOS PUPPET
      </h1>
      
      <p className="text-amber-700 text-center text-sm sm:text-base mb-6 max-w-xs">
        Guide your mischievous puppet to the goal!
        <br />
        <span className="text-xs text-amber-600">Warning: It doesn&apos;t always listen...</span>
      </p>
      
      {/* How to play */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 max-w-xs shadow-lg">
        <h3 className="font-bold text-amber-800 mb-2 text-sm">How to Play:</h3>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>🎯 Tap arrows to move the puppet</li>
          <li>⭐ Collect stars, hearts, and gems</li>
          <li>🚩 Reach the checkered flag</li>
          <li>⚡ Beware: puppet has a mind of its own!</li>
        </ul>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 text-xs text-amber-600 mb-4">
        <span>70% chance: Obeys</span>
        <span>20% chance: Rebels</span>
        <span>10% chance: Chaos!</span>
      </div>
      
      {/* High score */}
      {highScoreLoaded && highScore > 0 && (
        <div className="flex items-center gap-2 text-amber-700 mb-4">
          <Trophy className="w-5 h-5" />
          <span className="font-bold">High Score: {highScore}</span>
        </div>
      )}
      
      {/* Start button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
      >
        <Play className="w-6 h-6 fill-white" />
        START GAME
      </motion.button>
    </motion.div>
  )
}

export function PauseScreen() {
  const { resumeGame, resetGame } = useGameStore()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 rounded-xl z-20"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Pause className="w-8 h-8 text-amber-500" />
          <h2 className="text-2xl font-bold text-amber-800">PAUSED</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resumeGame}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            RESUME
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            QUIT
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export function GameOverScreen() {
  const { score, level, obeyCount, disobeyCount, randomCount, resetGame, highScore, highScoreLoaded, startGame } = useGameStore()
  const isNewHighScore = highScoreLoaded && score > 0 && score >= highScore && score === highScore
  
  const totalActions = obeyCount + disobeyCount + randomCount
  const obedienceRate = totalActions > 0 ? Math.round((obeyCount / totalActions) * 100) : 0
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-purple-900/90 flex flex-col items-center justify-center p-6 rounded-xl z-20"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <Skull className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">GAME OVER</h2>
        
        {isNewHighScore && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-full inline-flex items-center gap-2 mb-4"
          >
            <Trophy className="w-4 h-4" />
            NEW HIGH SCORE!
          </motion.div>
        )}
        
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <div className="text-3xl font-black text-amber-600 mb-1">{score}</div>
          <div className="text-sm text-gray-600">Final Score</div>
          
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div>
              <div className="font-bold text-gray-800">Level {level}</div>
              <div className="text-gray-500">Reached</div>
            </div>
            <div>
              <div className="font-bold text-green-600">{obedienceRate}%</div>
              <div className="text-gray-500">Obedient</div>
            </div>
            <div>
              <div className="font-bold text-purple-600">{disobeyCount}</div>
              <div className="text-gray-500">Rebellions</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            TRY AGAIN
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function LevelCompleteScreen() {
  const { score, level, nextLevel, obeyCount, disobeyCount, randomCount } = useGameStore()
  
  const totalActions = obeyCount + disobeyCount + randomCount
  const obedienceRate = totalActions > 0 ? Math.round((obeyCount / totalActions) * 100) : 0
  const levelBonus = level * 100
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-emerald-900/90 flex flex-col items-center justify-center p-6 rounded-xl z-20"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <PartyPopper className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">LEVEL COMPLETE!</h2>
        
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-4">
          <div className="text-3xl font-black text-green-600 mb-1">{score}</div>
          <div className="text-sm text-gray-600">Total Score</div>
          
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div>
              <div className="font-bold text-green-600">+{levelBonus}</div>
              <div className="text-gray-500">Level Bonus</div>
            </div>
            <div>
              <div className="font-bold text-amber-600">{obedienceRate}%</div>
              <div className="text-gray-500">Obedient</div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-100 rounded-xl p-3 mb-4">
          <div className="text-sm text-purple-700">
            Level {level + 1} will be harder...
            <br />
            <span className="text-xs text-purple-500">Chaos slightly reduced! 🎉</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextLevel}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 w-full"
        >
          NEXT LEVEL
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
