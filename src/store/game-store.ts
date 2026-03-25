import { create } from 'zustand'
import { sounds } from '@/lib/sounds'

export type Direction = 'up' | 'down' | 'left' | 'right'
export type PuppetMood = 'happy' | 'mischievous' | 'confused' | 'proud' | 'oops'

// Grid-based system - everything aligns to this
export const GRID_SIZE = 50
export const GRID_COLS = 12
export const GRID_ROWS = 12

export interface GridCell {
  gridX: number // 0 to GRID_COLS-1
  gridY: number // 0 to GRID_ROWS-1
}

export interface Obstacle {
  id: string
  gridX: number
  gridY: number
  type: 'spike' | 'pit' | 'bounce'
}

export interface Collectible {
  id: string
  gridX: number
  gridY: number
  collected: boolean
  type: 'star' | 'heart' | 'gem'
}

export interface GameState {
  // Puppet state (grid position)
  puppetGridX: number
  puppetGridY: number
  puppetMood: PuppetMood
  
  // Game state
  score: number
  level: number
  lives: number
  isPlaying: boolean
  isPaused: boolean
  gameOver: boolean
  levelComplete: boolean
  
  // Level data (grid-based)
  obstacles: Obstacle[]
  collectibles: Collectible[]
  goalGridX: number
  goalGridY: number
  
  // Canvas dimensions
  canvasWidth: number
  canvasHeight: number
  
  // Chaos feedback
  lastAction: 'obeyed' | 'disobeyed' | 'random' | null
  actionMessage: string
  showActionFeedback: boolean
  
  // Stats
  obeyCount: number
  disobeyCount: number
  randomCount: number
  highScore: number
  chaosLevel: number // 0-100, increases as you play
  highScoreLoaded: boolean
  
  // Actions
  movePuppet: (direction: Direction) => void
  collectItem: (id: string) => void
  checkCollisions: () => void
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  nextLevel: () => void
  resetGame: () => void
  loseLife: () => void
  setCanvasSize: (width: number, height: number) => void
  loadHighScore: () => void
}

const ACTION_MESSAGES = {
  obeyed: [
    "Fine, I'll listen... 😊",
    "Okay okay! 🎭",
    "This time I'm good! ✨",
    "You're welcome! 💫",
    "As you wish! 🌟",
  ],
  disobeyed: [
    "Nope! 😜",
    "I don't think so! 🙃",
    "Let's spice it up! 🔥",
    "Boring! Let's go the other way! 🎪",
    "Surprise! 🎉",
    "Rebel mode! 🤘",
  ],
  random: [
    "WHEEEE! 🎢",
    "Chaos is fun! 🌀",
    "I do what I want! 💃",
    "Plot twist! 📚",
    "Unexpected! ✨",
    "Freestyle! 🕺",
  ]
}

// Convert grid position to pixel position (centered in cell)
export const gridToPixel = (gridX: number, gridY: number) => ({
  x: gridX * GRID_SIZE + GRID_SIZE / 2,
  y: gridY * GRID_SIZE + GRID_SIZE / 2
})

// Check if a grid cell is blocked by an obstacle
function isCellBlocked(gridX: number, gridY: number, obstacles: Obstacle[]): boolean {
  return obstacles.some(obs => obs.gridX === gridX && obs.gridY === gridY)
}

// Generate level with grid-aligned positions
function generateLevel(level: number): { 
  obstacles: Obstacle[], 
  collectibles: Collectible[], 
  goalGridX: number, 
  goalGridY: number 
} {
  const obstacles: Obstacle[] = []
  const collectibles: Collectible[] = []
  
  // Starting area (left side) is safe
  const safeColumns = [0, 1] // First two columns are safe
  
  // Number of obstacles increases with level
  const obstacleCount = Math.min(3 + level, 15)
  const collectibleCount = Math.min(3 + Math.floor(level / 2), 8)
  
  // Track occupied cells
  const occupiedCells = new Set<string>()
  
  // Mark safe zone
  for (let x of safeColumns) {
    for (let y = 0; y < GRID_ROWS; y++) {
      occupiedCells.add(`${x},${y}`)
    }
  }
  
  // Generate obstacles
  for (let i = 0; i < obstacleCount; i++) {
    let attempts = 0
    let gridX: number, gridY: number
    
    do {
      // Obstacles only in columns 2-10 (leave last column for goal)
      gridX = 2 + Math.floor(Math.random() * (GRID_COLS - 3))
      gridY = Math.floor(Math.random() * GRID_ROWS)
      attempts++
    } while (occupiedCells.has(`${gridX},${gridY}`) && attempts < 100)
    
    if (attempts < 100) {
      const types: Obstacle['type'][] = ['spike', 'pit', 'bounce']
      const type = types[Math.floor(Math.random() * types.length)]
      
      obstacles.push({
        id: `obs-${i}`,
        gridX,
        gridY,
        type
      })
      occupiedCells.add(`${gridX},${gridY}`)
    }
  }
  
  // Generate collectibles
  for (let i = 0; i < collectibleCount; i++) {
    let attempts = 0
    let gridX: number, gridY: number
    
    do {
      gridX = 2 + Math.floor(Math.random() * (GRID_COLS - 3))
      gridY = Math.floor(Math.random() * GRID_ROWS)
      attempts++
    } while (occupiedCells.has(`${gridX},${gridY}`) && attempts < 100)
    
    if (attempts < 100) {
      const types: Collectible['type'][] = ['star', 'heart', 'gem']
      const type = types[Math.floor(Math.random() * types.length)]
      
      collectibles.push({
        id: `col-${i}`,
        gridX,
        gridY,
        collected: false,
        type
      })
      occupiedCells.add(`${gridX},${gridY}`)
    }
  }
  
  // Goal in last column
  let goalGridY: number
  do {
    goalGridY = Math.floor(Math.random() * GRID_ROWS)
  } while (occupiedCells.has(`${GRID_COLS - 1},${goalGridY}`))
  
  return { 
    obstacles, 
    collectibles, 
    goalGridX: GRID_COLS - 1, 
    goalGridY 
  }
}

const getRandomMessage = (action: 'obeyed' | 'disobeyed' | 'random') => {
  const messages = ACTION_MESSAGES[action]
  return messages[Math.floor(Math.random() * messages.length)]
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  puppetGridX: 1,
  puppetGridY: Math.floor(GRID_ROWS / 2),
  puppetMood: 'happy',
  
  score: 0,
  level: 1,
  lives: 3,
  isPlaying: false,
  isPaused: false,
  gameOver: false,
  levelComplete: false,
  
  obstacles: [],
  collectibles: [],
  goalGridX: GRID_COLS - 1,
  goalGridY: Math.floor(GRID_ROWS / 2),
  canvasWidth: GRID_SIZE * GRID_COLS,
  canvasHeight: GRID_SIZE * GRID_ROWS,
  
  lastAction: null,
  actionMessage: '',
  showActionFeedback: false,
  
  obeyCount: 0,
  disobeyCount: 0,
  randomCount: 0,
  highScore: 0,
  chaosLevel: 0,
  highScoreLoaded: false,
  
  // Load high score on client side (fixes hydration)
  loadHighScore: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chaosPuppetHighScore')
      if (saved) {
        set({ highScore: parseInt(saved) || 0, highScoreLoaded: true })
      } else {
        set({ highScoreLoaded: true })
      }
    }
  },
  
  // Actions
  movePuppet: (direction: Direction) => {
    const state = get()
    if (!state.isPlaying || state.isPaused || state.gameOver || state.levelComplete) return
    
    // Obedience calculation based on chaos level
    // Base: 70% obey, 20% disobey, 10% random
    // At max chaos: 30% obey, 40% disobey, 30% random
    
    const chaosNormalized = state.chaosLevel / 100 // 0 to 1
    
    // Interpolate between base and max chaos values
    const obeyChance = 0.70 - (chaosNormalized * 0.40)    // 0.70 -> 0.30
    const disobeyChance = 0.20 + (chaosNormalized * 0.20) // 0.20 -> 0.40
    const randomChance = 0.10 + (chaosNormalized * 0.20)  // 0.10 -> 0.30
    
    const roll = Math.random()
    let actualDirection: Direction = direction
    let action: 'obeyed' | 'disobeyed' | 'random'
    
    if (roll < obeyChance) {
      action = 'obeyed'
      set({ obeyCount: state.obeyCount + 1 })
      sounds.obey()
    } else if (roll < obeyChance + disobeyChance) {
      action = 'disobeyed'
      const opposites: Record<Direction, Direction> = {
        up: 'down', down: 'up', left: 'right', right: 'left'
      }
      actualDirection = opposites[direction]
      set({ disobeyCount: state.disobeyCount + 1 })
      sounds.disobey()
    } else {
      action = 'random'
      const directions: Direction[] = ['up', 'down', 'left', 'right']
      actualDirection = directions[Math.floor(Math.random() * 4)]
      set({ randomCount: state.randomCount + 1 })
      sounds.chaos()
    }
    
    // Calculate new grid position
    let newGridX = state.puppetGridX
    let newGridY = state.puppetGridY
    
    switch (actualDirection) {
      case 'up':
        newGridY -= 1
        break
      case 'down':
        newGridY += 1
        break
      case 'left':
        newGridX -= 1
        break
      case 'right':
        newGridX += 1
        break
    }
    
    // Clamp to grid bounds
    newGridX = Math.max(0, Math.min(GRID_COLS - 1, newGridX))
    newGridY = Math.max(0, Math.min(GRID_ROWS - 1, newGridY))
    
    const mood = action === 'obeyed' ? 'happy' : action === 'disobeyed' ? 'mischievous' : 'proud'
    
    // Slowly increase chaos (reduced rate)
    const chaosIncrease = 0.2 // Reduced from 0.5
    
    set({
      puppetGridX: newGridX,
      puppetGridY: newGridY,
      puppetMood: mood,
      lastAction: action,
      actionMessage: getRandomMessage(action),
      showActionFeedback: true,
      chaosLevel: Math.min(state.chaosLevel + chaosIncrease, 100)
    })
    
    // Clear feedback after delay
    setTimeout(() => {
      set({ showActionFeedback: false })
    }, 600)
    
    // Check collisions after move
    setTimeout(() => {
      get().checkCollisions()
    }, 50)
  },
  
  collectItem: (id) => {
    const state = get()
    const collectible = state.collectibles.find(c => c.id === id)
    if (collectible && !collectible.collected) {
      const points = collectible.type === 'gem' ? 50 : collectible.type === 'heart' ? 30 : 10
      set({
        collectibles: state.collectibles.map(c => 
          c.id === id ? { ...c, collected: true } : c
        ),
        score: state.score + points,
        puppetMood: 'proud'
      })
      sounds.collect()
    }
  },
  
  checkCollisions: () => {
    const state = get()
    const { puppetGridX, puppetGridY } = state
    
    // Check collectibles
    for (const collectible of state.collectibles) {
      if (!collectible.collected && 
          collectible.gridX === puppetGridX && 
          collectible.gridY === puppetGridY) {
        get().collectItem(collectible.id)
      }
    }
    
    // Check obstacles
    for (const obstacle of state.obstacles) {
      if (obstacle.gridX === puppetGridX && obstacle.gridY === puppetGridY) {
        if (obstacle.type === 'spike' || obstacle.type === 'pit') {
          get().loseLife()
          return
        } else if (obstacle.type === 'bounce') {
          // Bounce to random adjacent cell
          const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
          ]
          const validDirs = directions.filter(d => {
            const nx = puppetGridX + d.dx
            const ny = puppetGridY + d.dy
            return nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS
          })
          if (validDirs.length > 0) {
            const chosen = validDirs[Math.floor(Math.random() * validDirs.length)]
            set({ 
              puppetGridX: Math.max(0, Math.min(GRID_COLS - 1, puppetGridX + chosen.dx * 2)),
              puppetGridY: Math.max(0, Math.min(GRID_ROWS - 1, puppetGridY + chosen.dy * 2)),
              puppetMood: 'confused'
            })
          }
        }
      }
    }
    
    // Check goal
    if (puppetGridX === state.goalGridX && puppetGridY === state.goalGridY) {
      const bonus = state.level * 100
      set({
        levelComplete: true,
        score: state.score + bonus,
        puppetMood: 'proud'
      })
      sounds.levelComplete()
    }
  },
  
  startGame: () => {
    const level = generateLevel(1)
    set({
      puppetGridX: 1,
      puppetGridY: Math.floor(GRID_ROWS / 2),
      puppetMood: 'happy',
      score: 0,
      level: 1,
      lives: 3,
      isPlaying: true,
      isPaused: false,
      gameOver: false,
      levelComplete: false,
      obstacles: level.obstacles,
      collectibles: level.collectibles,
      goalGridX: level.goalGridX,
      goalGridY: level.goalGridY,
      obeyCount: 0,
      disobeyCount: 0,
      randomCount: 0,
      chaosLevel: 0
    })
    sounds.start()
  },
  
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  
  nextLevel: () => {
    const state = get()
    const nextLevelNum = state.level + 1
    const level = generateLevel(nextLevelNum)
    set({
      puppetGridX: 1,
      puppetGridY: Math.floor(GRID_ROWS / 2),
      puppetMood: 'happy',
      level: nextLevelNum,
      levelComplete: false,
      obstacles: level.obstacles,
      collectibles: level.collectibles,
      goalGridX: level.goalGridX,
      goalGridY: level.goalGridY,
      chaosLevel: Math.max(state.chaosLevel - 20, 0) // Reset chaos more on level up
    })
  },
  
  resetGame: () => {
    const state = get()
    if (state.score > state.highScore) {
      localStorage.setItem('chaosPuppetHighScore', state.score.toString())
      set({ highScore: state.score })
    }
    set({
      puppetGridX: 1,
      puppetGridY: Math.floor(GRID_ROWS / 2),
      puppetMood: 'happy',
      isPlaying: false,
      gameOver: false,
      levelComplete: false,
      score: 0,
      level: 1,
      lives: 3,
      obeyCount: 0,
      disobeyCount: 0,
      randomCount: 0,
      chaosLevel: 0
    })
  },
  
  loseLife: () => {
    const state = get()
    const newLives = state.lives - 1
    if (newLives <= 0) {
      if (state.score > state.highScore) {
        localStorage.setItem('chaosPuppetHighScore', state.score.toString())
        set({ highScore: state.score })
      }
      set({ lives: 0, gameOver: true, isPlaying: false, puppetMood: 'oops' })
      sounds.gameOver()
    } else {
      set({ 
        lives: newLives, 
        puppetGridX: 1, 
        puppetGridY: Math.floor(GRID_ROWS / 2),
        puppetMood: 'confused',
        chaosLevel: Math.max(state.chaosLevel - 15, 0)
      })
      sounds.loseLife()
    }
  },
  
  setCanvasSize: (width, height) => {
    set({ canvasWidth: width, canvasHeight: height })
  },
}))
