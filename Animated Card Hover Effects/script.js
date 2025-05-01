// document.querySelectorAll('.card').forEach(card => {
//     card.addEventListener('mousemove', e => {
//         const rect = card.getBoundingClientRect();
//         const x = e.clientX - rect.left - rect.width / 2;
//         const y = e.clientY - rect.top - rect.height / 2;

//         const rotateX = y / rect.height * 20; // Max 20deg tilt
//         const rotateY = x / rect.width * -20; // Max 20deg tilt

//         card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
//     });

//     card.addEventListener('mouseleave', () => {
//         card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
//     });
// });