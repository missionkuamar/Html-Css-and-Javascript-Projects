let countdownInterval;

function startCountdown() {
    const targetDateInput = document.getElementById('targetDate').value;
    const messageDiv = document.getElementById('message');

    if (!targetDateInput) {
        messageDiv.textContent = 'Please select a date and time.';
        return;
    }

    const targetDate = new Date(targetDateInput).getTime();
    const now = new Date().getTime();

    if (targetDate <= now) {
        messageDiv.textContent = 'Please select a future date and time.';
        return;
    }

    // Clear any existing interval
    clearInterval(countdownInterval);
    messageDiv.textContent = '';

    // Update countdown every second
    countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            messageDiv.textContent = 'Event has started!';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }, 1000);
}