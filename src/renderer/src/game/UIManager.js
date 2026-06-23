export class UIManager {
  constructor(root, callbacks) {
    this.callbacks = callbacks
    this.shell = document.createElement('div')
    this.shell.className = 'game-shell'
    this.shell.innerHTML = `
      <div class="pixi-host"></div>
      <div class="hud">
        <div class="level-label">关卡：1</div>
        <div class="hearts"></div>
        <div class="level-label"></div>
      </div>
      <div class="bottom-bar">
        <button class="tool-button" data-action="hint">提示</button>
        <button class="tool-button" data-action="reset">重置</button>
        <button class="tool-button" data-action="guide">辅助线</button>
      </div>
      <div class="overlay">
        <div class="dialog">
          <h1 class="dialog-title"></h1>
          <p class="dialog-text"></p>
          <div class="dialog-actions"></div>
        </div>
      </div>
    `

    root.appendChild(this.shell)
    this.pixiHost = this.shell.querySelector('.pixi-host')
    this.levelLabel = this.shell.querySelector('.level-label')
    this.hearts = this.shell.querySelector('.hearts')
    this.overlay = this.shell.querySelector('.overlay')
    this.dialogTitle = this.shell.querySelector('.dialog-title')
    this.dialogText = this.shell.querySelector('.dialog-text')
    this.dialogActions = this.shell.querySelector('.dialog-actions')
    this.guideButton = this.shell.querySelector('[data-action="guide"]')

    this.shell.querySelector('[data-action="hint"]').addEventListener('click', () => callbacks.onHint())
    this.shell.querySelector('[data-action="reset"]').addEventListener('click', () => callbacks.onReset())
    this.guideButton.addEventListener('click', () => callbacks.onToggleGuide())
  }

  setLevel(levelNumber) {
    this.levelLabel.textContent = `关卡：${levelNumber}`
  }

  setHearts(count) {
    this.hearts.innerHTML = ''

    for (let i = 0; i < 3; i += 1) {
      const heart = document.createElement('span')
      heart.className = `heart${i >= count ? ' empty' : ''}`
      heart.textContent = '♥'
      this.hearts.appendChild(heart)
    }
  }

  setGuideActive(active) {
    this.guideButton.classList.toggle('active', active)
  }

  showResult(type, hasNextLevel) {
    const isWin = type === 'win'
    this.dialogTitle.textContent = isWin ? '通关成功' : '游戏失败'
    this.dialogText.textContent = isWin ? '所有箭头线条都已清除。' : '心数用完了，再试一次。'
    this.dialogActions.innerHTML = ''

    const primary = document.createElement('button')
    primary.className = 'tool-button'
    primary.textContent = isWin ? (hasNextLevel ? '下一关' : '再来一轮') : '重新开始'
    primary.addEventListener('click', () => {
      this.hideResult()
      if (isWin) {
        this.callbacks.onNextLevel()
      } else {
        this.callbacks.onReset()
      }
    })

    this.dialogActions.appendChild(primary)
    this.overlay.classList.add('visible')
  }

  hideResult() {
    this.overlay.classList.remove('visible')
  }
}
