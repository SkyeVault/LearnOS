import { goBack, getApp } from "../../nav"

const PALETTE = ["#FF4444", "#FF8C00", "#FFD700", "#44BB44", "#4488FF", "#9944CC", "#FF69B4", "#000000", "#FFFFFF", "#00BFAE"]
const SIZES = [8, 16, 28, 44]
const BAR_H = 60
const TOOL_H = 64
const UI_H = BAR_H + TOOL_H

export function renderDoodle() {
  const swatches = PALETTE.map((color, index) => `<button id="dswatch-${index}" class="doodle-swatch" style="background:${color}" aria-label="Choose ${color}"></button>`).join("")
  const sizeButtons = SIZES.map((size, index) => `<button id="dsize-${index}" class="doodle-size" style="--ds:${size}px" aria-label="Choose brush size ${size}">●</button>`).join("")

  getApp().innerHTML = `<div id="doodle-topbar" class="doodle-topbar"><button id="doodle-back" class="back-btn">← Back</button><div class="doodle-title">✏️ Doodle Pad</div><button id="doodle-clear" class="count-btn count-btn--clear">Clear</button></div><div id="doodle-toolbar" class="doodle-toolbar"><div class="doodle-swatches">${swatches}</div><div class="doodle-divider"></div><div class="doodle-sizes">${sizeButtons}</div></div><canvas id="doodle-canvas" class="fixed-canvas" aria-label="Doodle drawing area"></canvas>`

  const canvas = document.getElementById("doodle-canvas") as HTMLCanvasElement
  const ctx = canvas.getContext("2d")!
  let drawing = false
  let activePointer: number | null = null
  let lastX = 0
  let lastY = 0
  let color = PALETTE[0]!
  let size = SIZES[1]!
  let cssWidth = 0
  let cssHeight = 0

  function paintBackground() {
    ctx.fillStyle = "#FAFAFA"
    ctx.fillRect(0, 0, cssWidth, cssHeight)
  }

  function resize() {
    const previous = canvas.width && canvas.height ? (() => {
      const snapshot = document.createElement("canvas")
      snapshot.width = canvas.width
      snapshot.height = canvas.height
      snapshot.getContext("2d")!.drawImage(canvas, 0, 0)
      return snapshot
    })() : null
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    cssWidth = window.innerWidth
    cssHeight = Math.max(window.innerHeight - UI_H, 1)
    canvas.width = Math.round(cssWidth * ratio)
    canvas.height = Math.round(cssHeight * ratio)
    canvas.style.top = `${UI_H}px`
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    paintBackground()
    if (previous) ctx.drawImage(previous, 0, 0, cssWidth, cssHeight)
  }

  function position(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    return { x: (event.clientX - rect.left) * (cssWidth / rect.width), y: (event.clientY - rect.top) * (cssHeight / rect.height) }
  }

  function dot(x: number, y: number) {
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  function beginStroke(event: PointerEvent) {
    if (event.pointerType === "mouse" && event.button !== 0) return
    event.preventDefault()
    const point = position(event)
    drawing = true
    activePointer = event.pointerId
    canvas.setPointerCapture(event.pointerId)
    lastX = point.x
    lastY = point.y
    dot(lastX, lastY)
  }

  function extendStroke(event: PointerEvent) {
    if (!drawing || activePointer !== event.pointerId) return
    event.preventDefault()
    const point = position(event)
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(point.x, point.y)
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
    lastX = point.x
    lastY = point.y
  }

  function endStroke(event: PointerEvent) {
    if (activePointer !== event.pointerId) return
    drawing = false
    activePointer = null
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }

  function setActiveSwatch(index: number) {
    PALETTE.forEach((_, itemIndex) => document.getElementById(`dswatch-${itemIndex}`)?.classList.toggle("doodle-swatch--active", itemIndex === index))
  }
  function setActiveSize(index: number) {
    SIZES.forEach((_, itemIndex) => document.getElementById(`dsize-${itemIndex}`)?.classList.toggle("doodle-size--active", itemIndex === index))
  }

  resize()
  setActiveSwatch(0)
  setActiveSize(1)
  window.addEventListener("resize", resize)
  PALETTE.forEach((item, index) => document.getElementById(`dswatch-${index}`)!.addEventListener("click", () => { color = item; setActiveSwatch(index) }))
  SIZES.forEach((item, index) => document.getElementById(`dsize-${index}`)!.addEventListener("click", () => { size = item; setActiveSize(index) }))
  document.getElementById("doodle-clear")!.addEventListener("click", paintBackground)
  document.getElementById("doodle-back")!.addEventListener("click", () => { window.removeEventListener("resize", resize); goBack() })
  canvas.addEventListener("pointerdown", beginStroke)
  canvas.addEventListener("pointermove", extendStroke)
  canvas.addEventListener("pointerup", endStroke)
  canvas.addEventListener("pointercancel", endStroke)
  canvas.addEventListener("lostpointercapture", () => { drawing = false; activePointer = null })
}
