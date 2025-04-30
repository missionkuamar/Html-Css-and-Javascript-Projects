document.getElementById('qrForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    const qrCodeDiv = document.getElementById('qrCode');
    const url = document.getElementById('url').value.trim();

    // Reset error and QR code
    errorMessage.textContent = '';
    qrCodeDiv.innerHTML = '';

    // Validation
    if (!url) {
        errorMessage.textContent = 'Please enter a URL.';
        return;
    }
    // Basic URL validation
    try {
        new URL(url);
    } catch {
        errorMessage.textContent = 'Please enter a valid URL (e.g., https://example.com).';
        return;
    }

    // Generate QR code
    new QRCode(qrCodeDiv, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H // High error correction
    });

    // Log URL (replace with backend API call if needed)
    console.log({ url });
});