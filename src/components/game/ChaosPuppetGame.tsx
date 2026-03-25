'use client'

import { useEffect, useCallback } from 'react'
import { useGameStore, Direction } from '@/store/game-store'
import { GameCanvas } from './GameCanvas'
import { ControlPad } from './ControlPad'
import { ActionFeedback } from './ActionFeedback'
import { GameHUD } from './GameHUD'
import { StartScreen, PauseScreen, GameOverScreen, LevelCompleteScreen } from './GameMenus'
import { Pause } from 'lucide-react'
import { ChaosBurst } from './ChaosBurst'
import { GameTips } from './GameTips'

export function ChaosPuppetGame() {
  const { 
    isPlaying, 
    isPaused, 
    gameOver, 
    levelComplete, 
    pauseGame,
    movePuppet,
    loadHighScore
  } = useGameStore()
  
  // Load high score on mount (fixes hydration issue)
  useEffect(() => {
    loadHighScore()
  }, [loadHighScore])
  
  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyMap: Record<string, Direction> = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right',
      'W': 'up',
      'S': 'down',
      'A': 'left',
      'D': 'right',
    }
    
    if (keyMap[e.key]) {
      e.preventDefault()
      movePuppet(keyMap[e.key])
    } else if (e.key === 'Escape' && isPlaying && !isPaused && !gameOver && !levelComplete) {
      pauseGame()
    }
  }, [movePuppet, isPlaying, isPaused, gameOver, levelComplete, pauseGame])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-safe">
        {/* Game container */}
        <div className="w-full max-w-lg flex flex-col items-center gap-4">
          {/* Title for when not playing */}
          {!isPlaying && !gameOver && (
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              🎭 CHAOS PUPPET
            </h1>
          )}
          
          {/* HUD - only show when playing */}
          {isPlaying && <GameHUD />}
          
          {/* Game canvas container */}
          <div className="relative w-full flex justify-center">
            <GameCanvas />
            <ChaosBurst />
            
            {/* Overlay screens */}
            {!isPlaying && !gameOver && <StartScreen />}
            {isPaused && <PauseScreen />}
            {gameOver && <GameOverScreen />}
            {levelComplete && <LevelCompleteScreen />}
          </div>
          
          {/* Controls */}
          {isPlaying && !isPaused && !gameOver && !levelComplete && (
            <div className="flex flex-col items-center gap-4">
              <ControlPad />
              
              {/* Pause button */}
              <button
                onClick={pauseGame}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                aria-label="Pause game"
              >
                <Pause className="w-5 h-5 text-amber-600" />
              </button>
              
              {/* Tips */}
              <GameTips />
            </div>
          )}
          
          {/* Action feedback overlay */}
          <ActionFeedback />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-amber-100 py-3 px-4 text-center border-t border-amber-200">
        <p className="text-xs text-amber-700">
          🎭 Chaos Puppet - A game of strategic unpredictability!
          <br />
          <span className="text-amber-600">Tap arrows or use WASD/Arrow keys</span>
        </p>
      </footer>
    </div>
  )
}
