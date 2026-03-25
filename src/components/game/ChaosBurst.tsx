'use client'

import { useMemo } from 'react'
import { useGameStore, gridToPixel } from '@/store/game-store'
import { motion, AnimatePresence } from 'framer-motion'

export function ChaosBurst() {
  const { showActionFeedback, lastAction, puppetGridX, puppetGridY, canvasWidth, canvasHeight } = useGameStore()
  
  // Get pixel position from grid
  const puppetPos = gridToPixel(puppetGridX, puppetGridY)
  
  // Create particles based on current state
  const particles = useMemo(() => {
    if (!showActionFeedback || lastAction === 'obeyed') return []
    
    const colors = lastAction === 'disobeyed' 
      ? ['#A855F7', '#EC4899', '#8B5CF6'] 
      : ['#F97316', '#FBBF24', '#EF4444']
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (puppetPos.x / canvasWidth) * 100,
      y: (puppetPos.y / canvasHeight) * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      angle: (i / 12) * Math.PI * 2,
      speed: 2 + Math.random() * 3
    }))
  }, [showActionFeedback, lastAction, puppetPos.x, puppetPos.y, canvasWidth, canvasHeight])
  
  if (!showActionFeedback || lastAction === 'obeyed') return null
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 1,
              opacity: 1
            }}
            animate={{ 
              x: `calc(${particle.x}% + ${Math.cos(particle.angle) * particle.speed * 50}px)`,
              y: `calc(${particle.y}% + ${Math.sin(particle.angle) * particle.speed * 50}px)`,
              scale: 0,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
