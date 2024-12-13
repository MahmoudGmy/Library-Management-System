// Select all minus buttons
document.querySelectorAll('.minus-btn').forEach((button) => {
    button.addEventListener('click', function () {
        const bookCard = this.closest('.book-card');
        const availableCountElem = bookCard.querySelector('.available-count');
        let availableCount = parseInt(availableCountElem.textContent);

        if (availableCount > 0) {
            availableCount -= 1;
            availableCountElem.textContent = availableCount;

            if (availableCount === 0) {
                alert('No more copies available.');
            }
        } else {
            alert('This book is already out of stock!');
        }
    });
});

// Select all plus buttons
document.querySelectorAll('.plus-btn').forEach((button) => {
    button.addEventListener('click', function () {
        const bookCard = this.closest('.book-card');
        const availableCountElem = bookCard.querySelector('.available-count');
        let availableCount = parseInt(availableCountElem.textContent);

        availableCount += 1;
        availableCountElem.textContent = availableCount;
    });
});
