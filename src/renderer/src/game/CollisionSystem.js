export function pointToSegmentDistance(point, a, b) {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const apx = point.x - a.x
  const apy = point.y - a.y
  const abLengthSq = abx * abx + aby * aby

  if (abLengthSq === 0) {
    return Math.hypot(point.x - a.x, point.y - a.y)
  }

  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLengthSq))
  const closest = {
    x: a.x + abx * t,
    y: a.y + aby * t
  }

  return Math.hypot(point.x - closest.x, point.y - closest.y)
}

function orientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
  if (Math.abs(value) < 0.0001) return 0
  return value > 0 ? 1 : 2
}

function onSegment(a, b, c) {
  return (
    b.x <= Math.max(a.x, c.x) + 0.0001 &&
    b.x >= Math.min(a.x, c.x) - 0.0001 &&
    b.y <= Math.max(a.y, c.y) + 0.0001 &&
    b.y >= Math.min(a.y, c.y) - 0.0001
  )
}

function segmentsIntersect(a1, a2, b1, b2) {
  const o1 = orientation(a1, a2, b1)
  const o2 = orientation(a1, a2, b2)
  const o3 = orientation(b1, b2, a1)
  const o4 = orientation(b1, b2, a2)

  if (o1 !== o2 && o3 !== o4) return true
  if (o1 === 0 && onSegment(a1, b1, a2)) return true
  if (o2 === 0 && onSegment(a1, b2, a2)) return true
  if (o3 === 0 && onSegment(b1, a1, b2)) return true
  if (o4 === 0 && onSegment(b1, a2, b2)) return true

  return false
}

export function segmentDistance(a1, a2, b1, b2) {
  if (segmentsIntersect(a1, a2, b1, b2)) return 0

  return Math.min(
    pointToSegmentDistance(a1, b1, b2),
    pointToSegmentDistance(a2, b1, b2),
    pointToSegmentDistance(b1, a1, a2),
    pointToSegmentDistance(b2, a1, a2)
  )
}

export function translatePolyline(points, offset) {
  return points.map((point) => ({
    x: point.x + offset.x,
    y: point.y + offset.y
  }))
}

export function polylineCollides(polylineA, polylineB, widthA, widthB) {
  const threshold = (widthA + widthB) / 2

  for (let i = 0; i < polylineA.length - 1; i += 1) {
    for (let j = 0; j < polylineB.length - 1; j += 1) {
      const distance = segmentDistance(polylineA[i], polylineA[i + 1], polylineB[j], polylineB[j + 1])
      if (distance <= threshold) return true
    }
  }

  return false
}

export function getMoveOutDistance(line, boardRect) {
  const dir = normalizeDirection(line.direction)
  let distance = 0

  for (const point of line.points) {
    if (dir.x > 0) distance = Math.max(distance, boardRect.x + boardRect.width - point.x + line.width * 3)
    if (dir.x < 0) distance = Math.max(distance, point.x - boardRect.x + line.width * 3)
    if (dir.y > 0) distance = Math.max(distance, boardRect.y + boardRect.height - point.y + line.width * 3)
    if (dir.y < 0) distance = Math.max(distance, point.y - boardRect.y + line.width * 3)
  }

  return Math.max(distance, 80)
}

export function canMoveOut(line, allLines, boardRect) {
  const dir = normalizeDirection(line.direction)
  const maxDistance = getMoveOutDistance(line, boardRect)
  const step = Math.max(6, Math.floor(line.width / 2))

  // Discrete sweep: move the whole polyline forward in small increments and test
  // each sampled position as a thick polyline against every other active line.
  for (let distance = step; distance <= maxDistance; distance += step) {
    const movedPoints = translatePolyline(line.points, {
      x: dir.x * distance,
      y: dir.y * distance
    })

    for (const other of allLines) {
      if (other.id === line.id || other.state === 'removed') continue
      if (polylineCollides(movedPoints, other.points, line.width, other.width)) {
        return false
      }
    }
  }

  return true
}

export function findHintLine(lines, boardRect) {
  return lines.find((line) => line.state === 'idle' && canMoveOut(line, lines, boardRect)) || null
}

export function normalizeDirection(direction) {
  const length = Math.hypot(direction.x, direction.y)
  if (length === 0) return { x: 1, y: 0 }

  return {
    x: direction.x / length,
    y: direction.y / length
  }
}
