const canvas = document.getElementById("canvas")
canvas.height = 650
canvas.width = 550

main()
function main(){

    touching()
    paint()
    setColor()
    setThickness()
    savePicture()
    setIntensity()
    clearBtn()
    eraser()
    saveSettings()
}

const ctx = canvas.getContext("2d")
ctx.fillStyle = "rgb(255,255,255)"
ctx.fillRect(0, 0, canvas.width, canvas.height)

let prevX = null
let prevY = null
let currentColor = 'black'
let currentThickness = 10
let currentIntensity = 50
let isErasing = false
let draw = false
loadSettings()
function setColor() {
    let selectedColor = document.getElementById('input-color')
    selectedColor.addEventListener('change', () => {
        currentColor = selectedColor.value
        ctx.strokeStyle = currentColor
    })
}
function setThickness() {
    let selectedThickness = document.getElementById('input-thickness')
    selectedThickness.value = 0
    selectedThickness.addEventListener('change', () => {
        currentThickness = selectedThickness.value
        ctx.lineWidth = currentThickness

    })
}
function setIntensity() {
    let selectedIntensity = document.getElementById('input-intensity')
    selectedIntensity.value = 100
    selectedIntensity.addEventListener('change', () => {
        let intensity = parseFloat(selectedIntensity.value)
        if (isNaN(intensity)) { //определяет является ли литерал или переменная нечисловым значением ( NaN ) или нет
            intensity = 50
        }
        currentIntensity = intensity / 100
        ctx.globalAlpha = currentIntensity
    })
}
function clearBtn() {
    let clearBtn = document.querySelector("#btn-clear")
    clearBtn.addEventListener("click", () => {
        ctx.globalAlpha = 1.0
        ctx.fillStyle = "rgb(255,255,255)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

    })


}
function eraser() {
    let eraserBtn = document.querySelector("#btn-eraser")
    eraserBtn.addEventListener("click", () => {
        isErasing = !isErasing // переключение состояния "ластика"
        if (isErasing) {
            ctx.strokeStyle = 'white'
            ctx.lineWidth = 20
            ctx.globalAlpha = 1.0
            eraserBtn.classList.add("active")
        } else {
            ctx.strokeStyle = currentColor
            ctx.lineWidth = currentThickness
            ctx.globalAlpha = currentIntensity
            eraserBtn.classList.remove("active")
        }
    })
}

function savePicture() {
// Сохраняю рисунок как картинку
    let saveBtn = document.querySelector("#btn-download")
    saveBtn.addEventListener("click", () => {
        let data = canvas.toDataURL("imag/png")
        let link = document.createElement("a")
        link.href = data
        link.download = "sketch.png"
        link.click()
    })
}
function touching() {
    window.addEventListener("mousedown", (e) => draw = true)
    window.addEventListener("mouseup", (e) => draw = false)
}
function paint() {
    window.addEventListener("mousemove", (e) => {
        if (prevX == null || prevY == null || !draw) {
            prevX = e.pageX - canvas.offsetLeft;
            prevY = e.pageY - canvas.offsetTop;
            return
        }

        let currentX = e.pageX - canvas.offsetLeft;
        let currentY = e.pageY - canvas.offsetTop;

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(currentX, currentY)
        ctx.lineCap = 'round'; // круглый конец линии
        ctx.lineJoin = 'bevel'; // скос соединения линий
        ctx.stroke()

        prevX = currentX
        prevY = currentY
    })
}

function saveSettings() {
    const btnSave = document.getElementById('btn-save')
    btnSave.addEventListener('click', () => {
        localStorage.setItem("color", currentColor)
        sendRequest(ctx.strokeStyle, ctx.globalAlpha, ctx.lineWidth)
    })
}

function loadSettings() {
    let savedColor = localStorage.getItem("color")
    if (savedColor) {
        let selectedColor = document.getElementById('input-color')
        selectedColor.value = savedColor
        ctx.strokeStyle = localStorage.getItem('color')
    }
}
function sendRequest(color, wight, intensive) {
    const getText = fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
            title: "picture",
            body: {
                color: color,
                wight: wight,
                intensive: intensive
            },
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    getText
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
        .finally(() => {
            alert("Сохранено")
        })
}
