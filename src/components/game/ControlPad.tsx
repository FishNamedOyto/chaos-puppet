'use client'

import { useCallback, useState } from 'react'
import { useGameStore, Direction } from '@/store/game-store'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export function ControlPad() {
  const { movePuppet, isPlaying, isPaused, gameOver, levelComplete } = useGameStore()
  const [pressedDirection, setPressedDirection] = useState<Direction | null>(null)
  
  const handleMove = useCallback((direction: Direction) => {
    if (!isPlaying || isPaused || gameOver || levelComplete) return
    movePuppet(direction)
    
    // Vibration feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
    
    setPressedDirection(direction)
    setTimeout(() => setPressedDirection(null), 100)
  }, [isPlaying, isPaused, gameOver, levelComplete, movePuppet])
  
  const isDisabled = !isPlaying || isPaused || gameOver || levelComplete
  
  const buttonClass = (dir: Direction) => `
    relative w-16 h-16 sm:w-20 sm:h-20
    rounded-xl
    flex items-center justify-center
    transition-all duration-75
    select-none
    ${isDisabled 
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
      : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg active:shadow-inner'
    }
    ${pressedDirection === dir ? 'scale-90 bg-orange-600' : 'hover:scale-105'}
    ${!isDisabled ? 'active:scale-95' : ''}
  `
  
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Up button */}
      <button
        className={buttonClass('up')}
        onTouchStart={(e) => { e.preventDefault(); handleMove('up') }}
        onMouseDown={() => handleMove('up')}
        disabled={isDisabled}
        aria-label="Move up"
      >
        <ChevronUp className="w-8 h-8" strokeWidth={3} />
      </button>
      
      {/* Left, Down, Right row */}
      <div className="flex gap-2">
        <button
          className={buttonClass('left')}
          onTouchStart={(e) => { e.preventDefault(); handleMove('left') }}
          onMouseDown={() => handleMove('left')}
          disabled={isDisabled}
          aria-label="Move left"
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={3} />
        </button>
        
        <button
          className={buttonClass('down')}
          onTouchStart={(e) => { e.preventDefault(); handleMove('down') }}
          onMouseDown={() => handleMove('down')}
          disabled={isDisabled}
          aria-label="Move down"
        >
          <ChevronDown className="w-8 h-8" strokeWidth={3} />
        </button>
        
        <button
          className={buttonClass('right')}
          onTouchStart={(e) => { e.preventDefault(); handleMove('right') }}
          onMouseDown={() => handleMove('right')}
          disabled={isDisabled}
          aria-label="Move right"
        >
          <ChevronRight className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>
      
      <p className="text-xs text-amber-700 mt-2 text-center font-medium">
        {isDisabled ? 'Start the game to play!' : 'Tap arrows or use keyboard'}
      </p>
    </div>
  )
}
