document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.question');
    const submitButton = document.getElementById('submit');

    questions.forEach(question => {
        const options = question.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                } else {
                    options.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                }
            });
        });
    });

    submitButton.addEventListener('click', function() {
        let scores = Array(9).fill(0);
        let allAnswered = true;

        questions.forEach(question => {
            const selectedOption = question.querySelector('.option.selected');
            if (selectedOption) {
                const scoresArray = JSON.parse(selectedOption.getAttribute('data-scores'));
                scores = scores.map((score, index) => score + scoresArray[index]);
            } else {
                allAnswered = false;
            }
        });

        if (allAnswered) {
            const maxScore = Math.max(...scores);
            const highestIndices = scores.map((score, index) => score === maxScore ? index + 1 : -1).filter(index => index > 0);
            const resultIndex = highestIndices[Math.floor(Math.random() * highestIndices.length)];
            window.location.href = `../results/result${resultIndex}.html`;
        } else {
            alert('Please answer all the questions.');
        }
    });
});