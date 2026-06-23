import { Container, Graphics } from 'pixi.js'
import { normalizeDirection, pointToSegmentDistance } from './CollisionSystem.js'

export class LineEntity {
  constructor(data) {
    this.id = data.id
    this.points = data.points
    this.direction = normalizeDirection(data.direction)
    this.width = data.width
    this.state = 'idle'
    this.offset = { x: 0, y: 0 }
    this.hintTime = 0
    this.isHinted = false

    this.container = new Container()
    this.lineGraphic = new Graphics()
    this.arrowGraphic = new Graphics()
    this.guideGraphic = new Graphics()

    this.container.addChild(this.guideGraphic)
    this.container.addChild(this.lineGraphic)
    this.container.addChild(this.arrowGraphic)
    this.render()
  }

  setPositionOffset(offset) {
    this.offset = offset
    this.container.position.set(offset.x, offset.y)
  }

  containsPoint(point) {
    if (this.state !== 'idle') return false

    const localPoint = {
      x: point.x - this.offset.x,
      y: point.y - this.offset.y
    }
    const threshold = this.width / 2 + 12

    // Hit testing uses point-to-segment distance for every segment in the polyline.
    for (let i = 0; i < this.points.length - 1; i += 1) {
      if (pointToSegmentDistance(localPoint, this.points[i], this.points[i + 1]) <= threshold) {
        return true
      }
    }

    return false
  }

  updateHint(deltaMS) {
    if (!this.isHinted) return

    this.hintTime += deltaMS / 1000
    this.render()
  }

  clearHint() {
    this.isHinted = false
    this.hintTime = 0
    this.render()
  }

  setHinted(value) {
    this.isHinted = value
    this.hintTime = 0
    this.render()
  }

  setGuideVisible(visible) {
    this.guideGraphic.visible = visible
  }

  render() {
    const pulse = this.isHinted ? (Math.sin(this.hintTime * 9) + 1) / 2 : 0
    const lineColor = this.state === 'blocked' ? 0xbd4242 : 0x262626
    const glowColor = 0xffc845

    this.lineGraphic.clear()
    this.arrowGraphic.clear()
    this.guideGraphic.clear()

    if (this.isHinted) {
      this.lineGraphic.moveTo(this.points[0].x, this.points[0].y)
      for (let i = 1; i < this.points.length; i += 1) {
        this.lineGraphic.lineTo(this.points[i].x, this.points[i].y)
      }
      this.lineGraphic.stroke({
        width: this.width + 12 + pulse * 6,
        color: glowColor,
        alpha: 0.45,
        cap: 'round',
        join: 'round'
      })
    }

    this.lineGraphic.moveTo(this.points[0].x, this.points[0].y)

    for (let i = 1; i < this.points.length; i += 1) {
      this.lineGraphic.lineTo(this.points[i].x, this.points[i].y)
    }
    this.lineGraphic.stroke({ width: this.width, color: lineColor, alpha: 1, cap: 'round', join: 'round' })

    this.drawArrowHead()
    this.drawGuide()
  }

  drawArrowHead() {
    const dir = this.direction
    const tip = this.getArrowAnchor()
    const size = 24
    const normal = { x: -dir.y, y: dir.x }
    const back = {
      x: tip.x - dir.x * size,
      y: tip.y - dir.y * size
    }

    this.arrowGraphic
      .poly([
        tip.x + dir.x * 12,
        tip.y + dir.y * 12,
        back.x + normal.x * 13,
        back.y + normal.y * 13,
        back.x - normal.x * 13,
        back.y - normal.y * 13
      ])
      .fill(0x262626)
  }

  getArrowAnchor() {
    const dir = this.direction
    const projections = this.points.map((point) => point.x * dir.x + point.y * dir.y)
    const maxProjection = Math.max(...projections)
    const epsilon = 0.001
    const edgeAnchors = []

    // For polylines, prefer the midpoint of the leading edge segment if one exists.
    for (let i = 0; i < this.points.length - 1; i += 1) {
      const start = this.points[i]
      const end = this.points[i + 1]
      const startProjection = start.x * dir.x + start.y * dir.y
      const endProjection = end.x * dir.x + end.y * dir.y

      if (Math.abs(startProjection - maxProjection) < epsilon && Math.abs(endProjection - maxProjection) < epsilon) {
        edgeAnchors.push({
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        })
      }
    }

    if (edgeAnchors.length > 0) {
      return edgeAnchors.reduce(
        (sum, point) => ({
          x: sum.x + point.x / edgeAnchors.length,
          y: sum.y + point.y / edgeAnchors.length
        }),
        { x: 0, y: 0 }
      )
    }

    const leadingPoint = this.points.find(
      (point) => Math.abs(point.x * dir.x + point.y * dir.y - maxProjection) < epsilon
    )

    return leadingPoint || this.points[this.points.length - 1]
  }

  drawGuide() {
    const center = this.getCenter()
    const dir = this.direction
    const start = {
      x: center.x - dir.x * 20,
      y: center.y - dir.y * 20
    }
    const end = {
      x: center.x + dir.x * 62,
      y: center.y + dir.y * 62
    }
    const normal = { x: -dir.y, y: dir.x }

    this.guideGraphic.moveTo(start.x, start.y).lineTo(end.x, end.y)
    this.guideGraphic.stroke({ width: 4, color: 0x2b8f83, alpha: 0.55, cap: 'round' })
    this.guideGraphic
      .poly([
        end.x + dir.x * 12,
        end.y + dir.y * 12,
        end.x - dir.x * 10 + normal.x * 8,
        end.y - dir.y * 10 + normal.y * 8,
        end.x - dir.x * 10 - normal.x * 8,
        end.y - dir.y * 10 - normal.y * 8
      ])
      .fill({ color: 0x2b8f83, alpha: 0.55 })
  }

  getCenter() {
    const total = this.points.reduce(
      (sum, point) => ({
        x: sum.x + point.x,
        y: sum.y + point.y
      }),
      { x: 0, y: 0 }
    )

    return {
      x: total.x / this.points.length,
      y: total.y / this.points.length
    }
  }
}
