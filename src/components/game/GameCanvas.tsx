'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useGameStore, GRID_SIZE, GRID_COLS, GRID_ROWS, gridToPixel } from '@/store/game-store'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const {
    puppetGridX,
    puppetGridY,
    puppetMood,
    obstacles,
    collectibles,
    goalGridX,
    goalGridY,
    isPlaying,
    isPaused,
    canvasWidth,
    canvasHeight
  } = useGameStore()
  
  // Convert grid to pixel for puppet
  const puppetPos = gridToPixel(puppetGridX, puppetGridY)
  
  // Draw puppet
  const drawPuppet = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, mood: string, time: number) => {
    const size = GRID_SIZE * 0.35 // Puppet size relative to grid cell
    const bounce = Math.sin(time / 200) * 2
    
    ctx.save()
    ctx.translate(x, y + bounce)
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.beginPath()
    ctx.ellipse(2, size + 3, size * 0.7, size * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Body gradient
    const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, 0, 0, size)
    gradient.addColorStop(0, '#FFE066')
    gradient.addColorStop(1, '#FFB020')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, size, 0, Math.PI * 2)
    ctx.fill()
    
    // Outline
    ctx.strokeStyle = '#E8850C'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Eyes
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.ellipse(-size * 0.35, -size * 0.2, size * 0.25, size * 0.3, 0, 0, Math.PI * 2)
    ctx.ellipse(size * 0.35, -size * 0.2, size * 0.25, size * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Pupils based on mood
    ctx.fillStyle = '#333'
    let leftPupilX = -size * 0.35
    let rightPupilX = size * 0.35
    let pupilY = -size * 0.2
    
    switch (mood) {
      case 'mischievous':
        leftPupilX -= size * 0.08
        rightPupilX += size * 0.08
        break
      case 'confused':
        leftPupilX -= size * 0.1
        rightPupilX += size * 0.1
        pupilY -= size * 0.1
        break
      case 'proud':
        pupilY -= size * 0.1
        break
      case 'oops':
        pupilY += size * 0.15
        break
    }
    
    ctx.beginPath()
    ctx.arc(leftPupilX, pupilY, size * 0.12, 0, Math.PI * 2)
    ctx.arc(rightPupilX, pupilY, size * 0.12, 0, Math.PI * 2)
    ctx.fill()
    
    // Eye shine
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.arc(leftPupilX - size * 0.04, pupilY - size * 0.06, size * 0.05, 0, Math.PI * 2)
    ctx.arc(rightPupilX - size * 0.04, pupilY - size * 0.06, size * 0.05, 0, Math.PI * 2)
    ctx.fill()
    
    // Mouth based on mood
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    
    switch (mood) {
      case 'happy':
        ctx.arc(0, size * 0.1, size * 0.3, 0.2, Math.PI - 0.2)
        break
      case 'mischievous':
        ctx.moveTo(-size * 0.3, size * 0.2)
        ctx.quadraticCurveTo(0, size * 0.4, size * 0.3, size * 0.15)
        break
      case 'confused':
        ctx.moveTo(-size * 0.2, size * 0.25)
        ctx.lineTo(size * 0.2, size * 0.2)
        break
      case 'proud':
        ctx.arc(0, size * 0.25, size * 0.2, 0.3, Math.PI - 0.3)
        break
      case 'oops':
        ctx.arc(0, size * 0.35, size * 0.15, Math.PI + 0.3, -0.3)
        break
    }
    ctx.stroke()
    
    // Cheeks
    if (mood === 'happy' || mood === 'proud') {
      ctx.fillStyle = 'rgba(255, 150, 150, 0.4)'
      ctx.beginPath()
      ctx.arc(-size * 0.6, size * 0.1, size * 0.15, 0, Math.PI * 2)
      ctx.arc(size * 0.6, size * 0.1, size * 0.15, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Strings
    ctx.strokeStyle = 'rgba(150, 100, 50, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-size * 0.4, -size)
    ctx.lineTo(-size * 0.4, -size - 20)
    ctx.moveTo(size * 0.4, -size)
    ctx.lineTo(size * 0.4, -size - 20)
    ctx.stroke()
    
    // Control bar
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-size * 0.5, -size - 20)
    ctx.lineTo(size * 0.5, -size - 20)
    ctx.stroke()
    
    ctx.restore()
  }, [])
  
  // Draw obstacle (fills entire grid cell)
  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, gridX: number, gridY: number, type: string, time: number) => {
    const x = gridX * GRID_SIZE
    const y = gridY * GRID_SIZE
    const padding = 2
    
    ctx.save()
    
    switch (type) {
      case 'spike':
        // Red spiky danger
        const spikeGradient = ctx.createLinearGradient(x, y, x + GRID_SIZE, y + GRID_SIZE)
        spikeGradient.addColorStop(0, '#DC2626')
        spikeGradient.addColorStop(1, '#991B1B')
        ctx.fillStyle = spikeGradient
        ctx.fillRect(x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
        
        // Spike pattern
        ctx.fillStyle = '#7F1D1D'
        const spikeCount = 3
        const spikeW = (GRID_SIZE - padding * 2) / spikeCount
        for (let i = 0; i < spikeCount; i++) {
          for (let j = 0; j < spikeCount; j++) {
            const cx = x + padding + i * spikeW + spikeW / 2
            const cy = y + padding + j * spikeW + spikeW / 2
            ctx.beginPath()
            ctx.moveTo(cx, cy - spikeW * 0.3)
            ctx.lineTo(cx + spikeW * 0.3, cy + spikeW * 0.3)
            ctx.lineTo(cx - spikeW * 0.3, cy + spikeW * 0.3)
            ctx.closePath()
            ctx.fill()
          }
        }
        
        // Danger border
        ctx.strokeStyle = '#450A0A'
        ctx.lineWidth = 2
        ctx.strokeRect(x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
        break
        
      case 'pit':
        // Dark pit
        const pitGradient = ctx.createRadialGradient(
          x + GRID_SIZE / 2, y + GRID_SIZE / 2, 0,
          x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2
        )
        pitGradient.addColorStop(0, '#1F2937')
        pitGradient.addColorStop(1, '#111827')
        ctx.fillStyle = pitGradient
        ctx.fillRect(x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
        
        // Danger border
        ctx.strokeStyle = '#EF4444'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 3])
        ctx.strokeRect(x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2)
        ctx.setLineDash([])
        break
        
      case 'bounce':
        // Green bouncer with animation
        const bounceOffset = Math.sin(time / 150) * 2
        const bounceGradient = ctx.createRadialGradient(
          x + GRID_SIZE / 2, y + GRID_SIZE / 2 - bounceOffset, 0,
          x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2
        )
        bounceGradient.addColorStop(0, '#4ADE80')
        bounceGradient.addColorStop(1, '#22C55E')
        ctx.fillStyle = bounceGradient
        
        // Rounded rectangle
        const r = 8
        ctx.beginPath()
        ctx.roundRect(x + padding, y + padding - bounceOffset, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2, r)
        ctx.fill()
        
        // Border
        ctx.strokeStyle = '#16A34A'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Arrow
        ctx.fillStyle = '#FFF'
        ctx.font = `bold ${GRID_SIZE * 0.4}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('↕', x + GRID_SIZE / 2, y + GRID_SIZE / 2 - bounceOffset)
        break
    }
    
    ctx.restore()
  }, [])
  
  // Draw collectible
  const drawCollectible = useCallback((ctx: CanvasRenderingContext2D, gridX: number, gridY: number, type: string, collected: boolean, time: number) => {
    if (collected) return
    
    const { x, y } = gridToPixel(gridX, gridY)
    const bounce = Math.sin(time / 250) * 3
    const size = GRID_SIZE * 0.3
    
    ctx.save()
    ctx.translate(x, y + bounce)
    
    switch (type) {
      case 'star':
        ctx.fillStyle = '#FBBF24'
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
          const r = size
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
        
      case 'heart':
        ctx.fillStyle = '#EC4899'
        ctx.strokeStyle = '#DB2777'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, size * 0.6)
        ctx.bezierCurveTo(-size, 0, -size, -size * 0.7, 0, -size * 0.2)
        ctx.bezierCurveTo(size, -size * 0.7, size, 0, 0, size * 0.6)
        ctx.fill()
        ctx.stroke()
        break
        
      case 'gem':
        ctx.fillStyle = '#A855F7'
        ctx.strokeStyle = '#9333EA'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(size * 0.8, -size * 0.2)
        ctx.lineTo(size * 0.5, size * 0.8)
        ctx.lineTo(-size * 0.5, size * 0.8)
        ctx.lineTo(-size * 0.8, -size * 0.2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.beginPath()
        ctx.moveTo(-size * 0.2, -size * 0.6)
        ctx.lineTo(size * 0.3, -size * 0.3)
        ctx.lineTo(size * 0.1, 0)
        ctx.lineTo(-size * 0.3, -size * 0.3)
        ctx.closePath()
        ctx.fill()
        break
    }
    
    ctx.restore()
  }, [])
  
  // Draw goal
  const drawGoal = useCallback((ctx: CanvasRenderingContext2D, gridX: number, gridY: number, time: number) => {
    const { x, y } = gridToPixel(gridX, gridY)
    const pulse = Math.sin(time / 300) * 0.1 + 1
    
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(pulse, pulse)
    
    // Glow
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)'
    ctx.beginPath()
    ctx.arc(0, 0, GRID_SIZE * 0.6, 0, Math.PI * 2)
    ctx.fill()
    
    // Flag pole
    ctx.fillStyle = '#78350F'
    ctx.fillRect(-3, -GRID_SIZE * 0.45, 6, GRID_SIZE * 0.9)
    
    // Flag
    ctx.fillStyle = '#22C55E'
    ctx.strokeStyle = '#16A34A'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(3, -GRID_SIZE * 0.45)
    ctx.lineTo(GRID_SIZE * 0.45, -GRID_SIZE * 0.35)
    ctx.lineTo(3, -GRID_SIZE * 0.2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Checkered pattern
    ctx.fillStyle = '#FFF'
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(5 + i * 6, -GRID_SIZE * 0.43 + j * 5, 6, 5)
        }
      }
    }
    
    // Base
    ctx.fillStyle = '#A16207'
    ctx.beginPath()
    ctx.ellipse(0, GRID_SIZE * 0.45, GRID_SIZE * 0.25, GRID_SIZE * 0.08, 0, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }, [])
  
  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const render = (time: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
      bgGradient.addColorStop(0, '#FEF3C7')
      bgGradient.addColorStop(1, '#FDE68A')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x <= GRID_COLS; x++) {
        ctx.beginPath()
        ctx.moveTo(x * GRID_SIZE, 0)
        ctx.lineTo(x * GRID_SIZE, canvasHeight)
        ctx.stroke()
      }
      for (let y = 0; y <= GRID_ROWS; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * GRID_SIZE)
        ctx.lineTo(canvasWidth, y * GRID_SIZE)
        ctx.stroke()
      }
      
      // Highlight safe zone (first 2 columns)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'
      ctx.fillRect(0, 0, GRID_SIZE * 2, canvasHeight)
      
      // Highlight goal column
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)'
      ctx.fillRect((GRID_COLS - 1) * GRID_SIZE, 0, GRID_SIZE, canvasHeight)
      
      // Border
      ctx.strokeStyle = '#D97706'
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, canvasWidth - 4, canvasHeight - 4)
      
      if (isPlaying && !isPaused) {
        // Draw goal
        drawGoal(ctx, goalGridX, goalGridY, time)
        
        // Draw obstacles
        obstacles.forEach(obs => drawObstacle(ctx, obs.gridX, obs.gridY, obs.type, time))
        
        // Draw collectibles
        collectibles.forEach(col => drawCollectible(ctx, col.gridX, col.gridY, col.type, col.collected, time))
        
        // Draw puppet
        drawPuppet(ctx, puppetPos.x, puppetPos.y, puppetMood, time)
      }
      
      animationRef.current = requestAnimationFrame(render)
    }
    
    animationRef.current = requestAnimationFrame(render)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [
    canvasWidth,
    canvasHeight,
    isPlaying,
    isPaused,
    puppetPos.x,
    puppetPos.y,
    puppetMood,
    obstacles,
    collectibles,
    goalGridX,
    goalGridY,
    drawPuppet,
    drawObstacle,
    drawCollectible,
    drawGoal
  ])
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="rounded-xl shadow-2xl border-4 border-amber-400"
      style={{ maxWidth: '100%', touchAction: 'none' }}
    />
  )
}
