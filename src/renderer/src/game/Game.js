import { Application, Container, Graphics } from 'pixi.js'
import { BOARD_RECT } from '../data/levels.js'
import { canMoveOut, findHintLine, getMoveOutDistance } from './CollisionSystem.js'
import { LevelManager } from './LevelManager.js'
import { LineEntity } from './LineEntity.js'
import { UIManager } from './UIManager.js'

export class Game {
  constructor(root) {
    this.root = root
    this.app = new Application()
    this.levelManager = new LevelManager()
    this.lines = []
    this.hearts = 3
    this.isBusy = false
    this.showGuides = false
    this.boardRect = BOARD_RECT
    this.gameLayer = new Container()
    this.lineLayer = new Container()

    this.ui = new UIManager(root, {
      onHint: () => this.showHint(),
      onReset: () => this.loadCurrentLevel(),
      onToggleGuide: () => this.toggleGuides(),
      onNextLevel: () => this.loadNextLevel()
    })
  }

  async start() {
    await this.app.init({
      width: 900,
      height: 1200,
      background: '#e9e3d5',
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    })

    this.ui.pixiHost.appendChild(this.app.canvas)
    this.app.stage.addChild(this.gameLayer)
    this.gameLayer.addChild(this.createBoardBackground())
    this.gameLayer.addChild(this.lineLayer)

    this.app.canvas.addEventListener('pointerdown', (event) => this.handlePointerDown(event))
    window.addEventListener('resize', () => this.resizeCanvas())
    this.app.ticker.add((ticker) => this.update(ticker.deltaMS))

    this.resizeCanvas()
    this.loadCurrentLevel()
  }

  resizeCanvas() {
    const bounds = this.ui.pixiHost.getBoundingClientRect()
    const scale = Math.min(bounds.width / 900, bounds.height / 1200)
    this.app.canvas.style.width = `${900 * scale}px`
    this.app.canvas.style.height = `${1200 * scale}px`
    this.app.canvas.style.display = 'block'
    this.app.canvas.style.margin = '0 auto'
  }

  createBoardBackground() {
    const graphics = new Graphics()
    const rect = this.boardRect

    graphics
      .roundRect(rect.x, rect.y, rect.width, rect.height, 8)
      .fill(0xfffdf7)
      .stroke({ width: 4, color: 0xd2c8b6, alpha: 1 })

    graphics
      .roundRect(rect.x + 16, rect.y + 16, rect.width - 32, rect.height - 32, 6)
      .stroke({ width: 2, color: 0xeee7d9, alpha: 1 })

    return graphics
  }

  loadCurrentLevel() {
    const level = this.levelManager.getCurrentLevel()
    this.hearts = 3
    this.isBusy = false
    this.ui.hideResult()
    this.ui.setLevel(this.levelManager.currentLevelNumber)
    this.ui.setHearts(this.hearts)

    this.lineLayer.removeChildren()
    this.lines = level.lines.map((data) => new LineEntity({ ...data, state: 'idle' }))

    for (const line of this.lines) {
      line.setGuideVisible(this.showGuides)
      this.lineLayer.addChild(line.container)
    }
  }

  loadNextLevel() {
    this.levelManager.nextLevel()
    this.loadCurrentLevel()
  }

  update(deltaMS) {
    for (const line of this.lines) {
      line.updateHint(deltaMS)
    }
  }

  handlePointerDown(event) {
    if (this.isBusy || this.hearts <= 0) return

    const rect = this.app.canvas.getBoundingClientRect()
    const point = {
      x: ((event.clientX - rect.left) / rect.width) * 900,
      y: ((event.clientY - rect.top) / rect.height) * 1200
    }

    for (let i = this.lines.length - 1; i >= 0; i -= 1) {
      const line = this.lines[i]
      if (line.containsPoint(point)) {
        this.tryMoveLine(line)
        return
      }
    }
  }

  tryMoveLine(line) {
    if (line.state !== 'idle') return

    this.clearHints()
    this.isBusy = true

    // State machine: idle -> moving -> removed on success, or idle -> blocked -> idle on failure.
    if (canMoveOut(line, this.lines, this.boardRect)) {
      this.animateLineOut(line)
    } else {
      this.failLineMove(line)
    }
  }

  animateLineOut(line) {
    line.state = 'moving'
    const distance = getMoveOutDistance(line, this.boardRect) + 90
    const duration = 420
    const startTime = performance.now()
    const dir = line.direction

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)

      line.setPositionOffset({
        x: dir.x * distance * eased,
        y: dir.y * distance * eased
      })

      if (t < 1) {
        requestAnimationFrame(step)
        return
      }

      line.state = 'removed'
      line.container.visible = false
      this.isBusy = false
      this.checkWin()
    }

    requestAnimationFrame(step)
  }

  failLineMove(line) {
    line.state = 'blocked'
    line.render()
    this.hearts = Math.max(0, this.hearts - 1)
    this.ui.setHearts(this.hearts)

    const duration = 260
    const startTime = performance.now()
    const dir = line.direction

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration)
      const shake = Math.sin(t * Math.PI * 8) * (1 - t) * 14

      line.setPositionOffset({
        x: dir.x * shake,
        y: dir.y * shake
      })

      if (t < 1) {
        requestAnimationFrame(step)
        return
      }

      line.setPositionOffset({ x: 0, y: 0 })
      line.state = 'idle'
      line.render()
      this.isBusy = false

      if (this.hearts <= 0) {
        this.ui.showResult('lose', this.levelManager.hasNextLevel())
      }
    }

    requestAnimationFrame(step)
  }

  checkWin() {
    // Victory is strict: every line must be in the removed state.
    if (this.lines.every((line) => line.state === 'removed')) {
      this.ui.showResult('win', this.levelManager.hasNextLevel())
    }
  }

  showHint() {
    if (this.isBusy || this.hearts <= 0) return

    this.clearHints()
    const hintLine = findHintLine(this.lines, this.boardRect)

    if (hintLine) {
      hintLine.setHinted(true)
      window.setTimeout(() => {
        hintLine.clearHint()
      }, 2200)
    }
  }

  clearHints() {
    for (const line of this.lines) {
      line.clearHint()
    }
  }

  toggleGuides() {
    this.showGuides = !this.showGuides
    this.ui.setGuideActive(this.showGuides)

    for (const line of this.lines) {
      line.setGuideVisible(this.showGuides)
    }
  }
}
