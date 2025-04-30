document.getElementById('colorPicker').addEventListener('input', updateColor);

function updateColor() {
    const color = document.getElementById('colorPicker').value;
    document.getElementById('colorDisplay').style.backgroundColor = color;
    document.getElementById('colorCode').textContent = color.toUpperCase();
}

function copyToClipboard() {
    const color = document.getElementById('colorPicker').value;
    navigator.clipboard.writeText(color).then(() => {
        const copyMessage = document.getElementById('copyMessage');
        copyMessage.classList.remove('hidden');
        setTimeout(() => {
            copyMessage.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize with default color
updateColor();