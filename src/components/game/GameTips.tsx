'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TIPS = [
  "💡 Tip: Sometimes chaos works in your favor!",
  "💡 Tip: The puppet might help you find shortcuts...",
  "💡 Tip: Chaos level increases as you play!",
  "💡 Tip: Green bouncers can launch you forward!",
  "💡 Tip: Gems are worth 50 points!",
  "💡 Tip: Higher chaos = more unpredictable!",
  "💡 Tip: Each level reduces chaos slightly...",
  "💡 Tip: Watch the puppet's mood for hints!",
]

export function GameTips() {
  const [tip, setTip] = useState(TIPS[0])
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    // Change tip every 8 seconds
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)])
        setVisible(true)
      }, 500)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
            {tip}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
