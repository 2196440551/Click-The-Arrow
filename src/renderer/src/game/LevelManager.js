import { levels } from '../data/levels.js'

export class LevelManager {
  constructor() {
    this.currentIndex = 0
  }

  get currentLevelNumber() {
    return this.currentIndex + 1
  }

  getCurrentLevel() {
    return structuredClone(levels[this.currentIndex])
  }

  hasNextLevel() {
    return this.currentIndex < levels.length - 1
  }

  nextLevel() {
    if (this.hasNextLevel()) {
      this.currentIndex += 1
    } else {
      this.currentIndex = 0
    }

    return this.getCurrentLevel()
  }

  resetToFirst() {
    this.currentIndex = 0
  }
}
