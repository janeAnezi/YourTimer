document.addEventListener('DOMContentLoaded', function() {
    const timerInput = document.getElementById('timer');
    const startButton = document.getElementById('start');
    const quizContainer = document.getElementById('quiz');
    let apiData = [];

    function fetchQuizData() {
        const apiKey = CONFIG.API_KEY;
        fetch(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=50`)
            .then(response => response.json())
            .then(data => {
                apiData = data;
                renderQuiz(data);
                //showQuestion(0); // to show the first question initially
            })
            .catch(error => console.error('Error fetching quiz data:', error));
    }

    function renderQuiz(data) {
        data.forEach((item, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-section'); 
            questionDiv.id = `question-${index}`;
            questionDiv.style.display = 'none'; // to hide all questions initially

            const questionTitle = document.createElement('div');
            questionTitle.classList.add('question');
            questionTitle.innerText = item.question;
            questionDiv.appendChild(questionTitle);

            const answersList = document.createElement('ul');
            answersList.classList.add('answers');

            Object.keys(item.answers).forEach(answerKey => {
                if (item.answers[answerKey]) {
                    const answerItem = document.createElement('li');
                    answerItem.classList.add('answer');
                    const answerRadio = document.createElement('input');
                    answerRadio.type = 'checkbox';
                    answerRadio.name = `question-${item.id}`;
                    answerRadio.value = answerKey;
                    answerRadio.id = `question-${item.id}-${answerKey}`;

                    answerRadio.addEventListener('change', () => {
                        userAnswers[index] = answerKey;
                    });

                    const answerLabel = document.createElement('label');
                    answerLabel.setAttribute('for', answerRadio.id);
                    answerLabel.innerHTML = item.answers[answerKey];

                    answerItem.appendChild(answerRadio);
                    answerItem.appendChild(answerLabel);
                    answersList.appendChild(answerItem);
                }
            });

            questionDiv.appendChild(answersList);

            const nextButton = document.createElement('button');
            nextButton.innerText = 'Next';
            nextButton.classList.add('next-button');
            nextButton.addEventListener('click', () => {
                showQuestion(index + 1);
            });
            questionDiv.appendChild(nextButton);

            quizContainer.appendChild(questionDiv);
        });
    }

    function showQuestion(index) {
        const allQuestions = document.querySelectorAll('.question-section'); 
        allQuestions.forEach((question, i) => {
            question.style.display = i === index ? 'block' : 'none';
        });
    }

    function checkAnswers() {
        let correctAnswers = 0;
        apiData.forEach((item, index) => {
            const selectedAnswer = userAnswers[index];
            if (selectedAnswer) {
                const isCorrect = item.correct_answers[`${selectedAnswer}_correct`] === "true";
                if (isCorrect) {
                    correctAnswers++;
                }
            }
        });

        const totalQuestions = apiData.length;
        const percentage = (correctAnswers / totalQuestions) * 100;

        alert(`You answered ${correctAnswers} out of ${totalQuestions} questions correctly. Your score is ${percentage.toFixed(2)}%.`);
    }

    let countdownInterval;

    function startCountdown() {
        let time = timerInput.value.split(':');
        let hours = parseInt(time[0], 10);
        let minutes = parseInt(time[1], 10);
        let seconds = parseInt(time[2], 10);

        let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        countdownInterval = setInterval(function() {
            totalSeconds--;
            if (totalSeconds < 0) {
                clearInterval(countdownInterval);
                alert('Time is up!');
                checkAnswers();
                return;
            }

            let h = Math.floor(totalSeconds / 3600);
            let m = Math.floor((totalSeconds % 3600) / 60);
            let s = totalSeconds % 60;

            timerInput.value =
                (h > 9 ? h : "0" + h) + ":" +
                (m > 9 ? m : "0" + m) + ":" +
                (s > 9 ? s : "0" + s);
        }, 1000);
    }

    startButton.addEventListener('click', function() {
        document.querySelector('.timer-container').classList.add('top-right');
        document.getElementById('timer').style.fontSize = '20px';
        document.getElementById('submit').style.fontSize = '10px';
        document.querySelector('.start-message').style.display = 'none';
        document.querySelector('.question-section').style.display = 'block';
        startButton.style.display = 'none';
        clearInterval(countdownInterval); // to Clear any existing interval
        startCountdown();
    });

    document.getElementById('submit').addEventListener('click', () => {
        clearInterval(countdownInterval);
        checkAnswers();
    });

    fetchQuizData();
});
