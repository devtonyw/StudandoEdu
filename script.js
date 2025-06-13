const DURATION = 15000; // 15 segundos em ms
const MAX_ROUNDS = 10;

let correctAnswers = 0;
let currentRound = 0;
let totalTime = 0;
let timer = null;
let currentQuestion = null;
let selectedLevel = '';
let selectedSubject = '';

// Mapeia os níveis de ensino para os conjuntos de questões correspondentes
const EDUCATION_LEVELS_MAP = {
    'basic': {
        'portuguese': BASIC_PORTUGUESE_QUESTIONS,
        'math': BASIC_MATH_QUESTIONS,
        'science': BASIC_SCIENCE_QUESTIONS,
        'history': BASIC_HISTORY_QUESTIONS,
        'geography': BASIC_GEOGRAPHY_QUESTIONS,
        'art': BASIC_ART_QUESTIONS
    },
    'elementary': {
        'portuguese': ELEMENTARY_PORTUGUESE_QUESTIONS,
        'math': ELEMENTARY_MATH_QUESTIONS,
        'science': ELEMENTARY_SCIENCE_QUESTIONS,
        'history': ELEMENTARY_HISTORY_QUESTIONS,
        'geography': ELEMENTARY_GEOGRAPHY_QUESTIONS,
        'art': ELEMENTARY_ART_QUESTIONS
    },
    'high': {
        'portuguese': HIGH_PORTUGUESE_QUESTIONS,
        'english': HIGH_ENGLISH_QUESTIONS,
        'art': HIGH_ART_QUESTIONS,
        'math': HIGH_MATH_QUESTIONS,
        'physics': HIGH_PHYSICS_QUESTIONS
    },
    'technical': {
        'administration': TECHNICAL_ADMINISTRATION_QUESTIONS,
        'electrotechnics': TECHNICAL_ELECTROTECHNICS_QUESTIONS,
        'agriculture': TECHNICAL_AGRICULTURE_QUESTIONS
    },
    'college': {
        'administration': COLLEGE_ADMINISTRATION_QUESTIONS,
        'computerScience': COLLEGE_COMPUTER_SCIENCE_QUESTIONS,
        'food': COLLEGE_FOOD_QUESTIONS
    }
};

function startGame(level, subject) {
    selectedLevel = level;
    selectedSubject = subject;
    correctAnswers = 0;
    currentRound = 0;
    totalTime = 0;
    getNextQuestion();
}

function getNextQuestion() {
    if (currentRound >= MAX_ROUNDS) {
        endGame();
        return;
    }

    const questions = EDUCATION_LEVELS_MAP[selectedLevel][selectedSubject];
    const availableQuestions = Object.keys(questions);
    
    if (availableQuestions.length === 0) {
        endGame();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    const answers = questions[question];
    
    currentQuestion = {
        question: question,
        answers: shuffleArray([...answers]),
        correctAnswer: answers[0]
    };

    displayQuestion(currentQuestion);
    startTimer();
    currentRound++;
}

function checkAnswer(selectedAnswer) {
    clearTimeout(timer);
    if (selectedAnswer === currentQuestion.correctAnswer) {
        correctAnswers++;
    }

    if (currentRound < MAX_ROUNDS) {
        getNextQuestion();
    } else {
        endGame();
    }
}

function startTimer() {
    let timeLeft = DURATION / 1000;
    updateTimerDisplay(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        totalTime += 1000;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            getNextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = timeLeft.toString().padStart(2, '0');
    }
}

function endGame() {
    clearTimeout(timer);
    const percentage = (correctAnswers / MAX_ROUNDS) * 100;
    const timeInMinutes = Math.floor(totalTime / 60000);
    const timeInSeconds = Math.floor((totalTime % 60000) / 1000);

    localStorage.setItem('gameResults', JSON.stringify({
        score: correctAnswers,
        total: MAX_ROUNDS,
        percentage: percentage,
        time: `${timeInMinutes}:${timeInSeconds.toString().padStart(2, '0')}`
    }));

    window.location.href = 'gameOverPage.html';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestion(questionData) {
    const questionText = document.getElementById('question-text');
    const options = document.querySelectorAll('.option');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');

    if (questionText) questionText.textContent = questionData.question;
    
    options.forEach((option, index) => {
        option.textContent = questionData.answers[index];
        option.onclick = () => checkAnswer(questionData.answers[index]);
    });

    if (progressBar) {
        progressBar.style.width = `${(currentRound / MAX_ROUNDS) * 100}%`;
    }

    if (questionCounter) {
        questionCounter.textContent = `Pergunta ${currentRound} de ${MAX_ROUNDS}`;
    }
}

function resetGame() {
    window.location.href = 'selectionPage.html';
}