"use strict";

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const participantNameInput = document.getElementById("participant-name");
const participantEmailInput = document.getElementById("participant-email");

const startButton = document.getElementById("start-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const restartButton = document.getElementById("restart-button");

const questionText = document.getElementById("question-text");
const answerContainer = document.getElementById("answer-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const participantResult = document.getElementById("participant-result");
const scorePercentage = document.getElementById("score-percentage");
const scoreDetails = document.getElementById("score-details");
const passFailResult = document.getElementById("pass-fail-result");
const reviewContainer = document.getElementById("review-container");

let currentQuestionIndex = 0;
let participantAnswers = [];
let quizQuestions = [];

const passingScore = 80;

function startQuiz() {
    const name = participantNameInput.value.trim();
    const email = participantEmailInput.value.trim();

    if (!name || !email) {
        alert("Please enter your full name and email address.");
        return;
    }

    quizQuestions = [...questionBank];
    participantAnswers = new Array(quizQuestions.length).fill(null);
    currentQuestionIndex = 0;

    welcomeScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    resultsScreen.classList.add("hidden");

    displayQuestion();
}

function displayQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    questionText.textContent = currentQuestion.question;
    answerContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, answerIndex) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-option";
        button.textContent = answer;

        if (participantAnswers[currentQuestionIndex] === answerIndex) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            participantAnswers[currentQuestionIndex] = answerIndex;
            displayQuestion();
        });

        answerContainer.appendChild(button);
    });

    updateProgress();
    updateNavigation();
}

function updateProgress() {
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = quizQuestions.length;

    progressText.textContent =
        `Question ${questionNumber} of ${totalQuestions}`;

    const progressPercent =
        (questionNumber / totalQuestions) * 100;

    progressBar.style.width = `${progressPercent}%`;
}

function updateNavigation() {
    previousButton.disabled = currentQuestionIndex === 0;

    const isLastQuestion =
        currentQuestionIndex === quizQuestions.length - 1;

    nextButton.classList.toggle("hidden", isLastQuestion);
    submitButton.classList.toggle("hidden", !isLastQuestion);
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex -= 1;
        displayQuestion();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex += 1;
        displayQuestion();
    }
}

function submitQuiz() {
    const unanswered = participantAnswers.filter(
        answer => answer === null
    ).length;

    if (unanswered > 0) {
        const submitAnyway = confirm(
            `You have ${unanswered} unanswered question(s). Submit anyway?`
        );

        if (!submitAnyway) {
            return;
        }
    }

    let correctCount = 0;

    quizQuestions.forEach((question, index) => {
        if (participantAnswers[index] === question.correctAnswer) {
            correctCount += 1;
        }
    });

    const percentage = Math.round(
        (correctCount / quizQuestions.length) * 100
    );

    showResults(correctCount, percentage);
}

function showResults(correctCount, percentage) {
    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    participantResult.textContent =
        `${participantNameInput.value}, your final score is:`;

    scorePercentage.textContent = `${percentage}%`;

    scoreDetails.textContent =
        `${correctCount} of ${quizQuestions.length} correct`;

    const passed = percentage >= passingScore;

    passFailResult.textContent = passed ? "PASS" : "NOT PASSED";
    passFailResult.className = passed ? "pass" : "fail";

    reviewContainer.innerHTML = "<h3>Review missed questions</h3>";

    quizQuestions.forEach((question, index) => {
        const selectedAnswer = participantAnswers[index];

        if (selectedAnswer !== question.correctAnswer) {
            const reviewItem = document.createElement("div");

            reviewItem.className = "review-item";

            const selectedText =
                selectedAnswer === null
                    ? "No answer selected"
                    : question.answers[selectedAnswer];

            reviewItem.innerHTML = `
                <p><strong>${question.question}</strong></p>
                <p>Your answer: ${selectedText}</p>
                <p class="correct-answer">
                    Correct answer:
                    ${question.answers[question.correctAnswer]}
                </p>
                <p>${question.explanation || ""}</p>
            `;

            reviewContainer.appendChild(reviewItem);
        }
    });
}

function restartQuiz() {
    participantAnswers = [];
    quizQuestions = [];
    currentQuestionIndex = 0;

    resultsScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
}

startButton.addEventListener("click", startQuiz);
previousButton.addEventListener("click", goToPreviousQuestion);
nextButton.addEventListener("click", goToNextQuestion);
submitButton.addEventListener("click", submitQuiz);
restartButton.addEventListener("click", restartQuiz);
