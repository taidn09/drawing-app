const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const toolBtns = document.querySelectorAll('.tool')
const fillColor = document.getElementById('fill-color')
const sideSlider = document.getElementById('size-slider')
const colorBtns = document.querySelectorAll('.colors .option')
const colorPicker = document.getElementById('color-picker')
const clearCanvas = document.querySelector('.clear-canvas')
const saveImg = document.querySelector('.save-img')





let prevMouseX, prevMouseY, snapShot
let isDrawing = false
let brushWidth = 5
let colorSelected = "rgb(0, 0, 0)"
let toolSelected = 'brush'
// get canvas width, canvas height
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})
function setCanvasBackground() {
    ctx.fillStyle= '#fff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = colorSelected
}
// draw
const draw = (e) => {
    if (!isDrawing) return
    ctx.putImageData(snapShot, 0, 0)
    switch (toolSelected) {
        case 'brush':
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            break;
        case 'eraser':
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
            ctx.strokeStyle = '#fff'
            break;
        case 'rectangle':
            drawRectangle(e)
            break;
        case 'triangle':
            drawTriangle(e)
            break;
        case 'circle':
            drawCircle(e)
            break;
        default:
            break;
    }
}

// star drawing
const startDrawing = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth
    ctx.strokeStyle = colorSelected
    ctx.fillStyle = colorSelected
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// draw Rectangle
function drawRectangle(e) {
    fillColor.checked ?
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY) :
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}
// draw Triangle
function drawTriangle(e) {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}
// draw Circle
function drawCircle(e) {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}
// add event for each tool button
toolBtns.forEach(toolBtn => {
    toolBtn.addEventListener('click', function () {
        toolSelected = this.id
        document.querySelector('.tool.active').classList.remove('active')
        this.classList.add('active')
    })
})
//brush width
sideSlider.addEventListener('change', () => brushWidth = sideSlider.value)
// color 
colorBtns.forEach(colorBtn => {
    colorBtn.addEventListener('click', function () {
        document.querySelector('.colors .option.active').classList.remove('active')
        this.classList.add('active')
        colorSelected = window.getComputedStyle(this).getPropertyValue('background-color');
    })
})
// color picker
colorPicker.addEventListener('change', function () {
    this.parentElement.style.backgroundColor = this.value
    colorSelected = this.value
})

// clear canvas
clearCanvas.addEventListener('click',function () {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    setCanvasBackground()
})

// save image
saveImg.addEventListener('click',function () {
    const link = document.createElement('a')
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    console.log(link.href);
    link.click()
})
// canvas event
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', () => isDrawing = false)
