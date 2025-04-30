function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = src;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}

// Close modal on button click
document.getElementById('close-modal').addEventListener('click', closeModal);

// Close modal on clicking outside the image
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        closeModal();
    }
});