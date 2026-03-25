# 🎭 Chaos Puppet

A wildly original browser game where **imperfect control is the core mechanic!**

## 🎮 The Game

Guide your mischievous puppet to the goal, but beware - it doesn't always listen!

- **70% chance**: Puppet obeys
- **20% chance**: Puppet rebels (does the opposite!)
- **10% chance**: Puppet goes random (chaos!)

As you play, the **Chaos Meter** increases, making the puppet more unpredictable!

## 🚀 Deploy to Cloudflare Pages

### Option 1: via GitHub

1. Push this code to a GitHub repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Framework preset**: Next.js (Static Export)
   - **Build command**: `npm run build` or `bun run build`
   - **Build output directory**: `out`
   - **Node version**: 18 or higher
6. Click "Save and Deploy"

### Option 2: Direct Upload

1. Run `bun run build` locally
2. Upload the `out` folder to Cloudflare Pages

## 🛠 Local Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

## 🎯 How to Play

1. Click **START GAME**
2. Tap arrows or use **WASD/Arrow keys** to move
3. Collect items for points:
   - ⭐ Stars: 10 points
   - 💖 Hearts: 30 points
   - 💎 Gems: 50 points
4. Avoid obstacles:
   - 🔴 Red spikes: Instant death
   - ⬛ Dark pits: Instant death
   - 🟢 Green bouncers: Bounce you away
5. Reach the 🚩 checkered flag to complete the level!

## ✨ Features

- **Grid-based movement** - Clear, predictable positioning
- **Procedural audio** - No external files needed (Web Audio API)
- **Responsive design** - Works on mobile and desktop
- **Touch controls** - Tap-friendly buttons
- **Keyboard support** - WASD or Arrow keys
- **High score** - Saved locally
- **Progressive chaos** - Gets harder as you play!

## 📦 Tech Stack

- Next.js 16 (Static Export)
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand (state management)
- Framer Motion (animations)
- Web Audio API (sound effects)

## 📄 License

MIT License - Feel free to use and modify!
