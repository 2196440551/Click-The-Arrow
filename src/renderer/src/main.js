import './styles/index.css'
import 'pixi.js/unsafe-eval'
import { Game } from './game/Game.js'

const root = document.querySelector('#app')
const game = new Game(root)

game.start()
