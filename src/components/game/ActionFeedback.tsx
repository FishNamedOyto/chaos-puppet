'use client'

import { useGameStore } from '@/store/game-store'
import { motion, AnimatePresence } from 'framer-motion'

export function ActionFeedback() {
  const { showActionFeedback, lastAction, actionMessage } = useGameStore()
  
  const bgColors = {
    obeyed: 'bg-green-500',
    disobeyed: 'bg-purple-500',
    random: 'bg-pink-500'
  }
  
  const emojis = {
    obeyed: '✨',
    disobeyed: '😜',
    random: '🎪'
  }
  
  return (
    <AnimatePresence>
      {showActionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className={`${bgColors[lastAction!]} text-white px-6 py-3 rounded-2xl shadow-2xl`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{emojis[lastAction!]}</span>
              <span className="font-bold text-lg">{actionMessage}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
