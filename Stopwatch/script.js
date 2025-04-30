let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10); // Update every 10ms
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
}

function stopStopwatch() {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    display.textContent = '00:00:00.000';
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    const time = formatTime(elapsedTime);
    display.textContent = time;
}

function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    ms %= 1000 * 60 * 60;
    const minutes = Math.floor(ms / (1000 * 60));
    ms %= 1000 * 60;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    return (
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + '.' +
        String(milliseconds).padStart(3, '0')
    );
}