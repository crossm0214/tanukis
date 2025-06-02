const animals = [
    { 
        id: 'raccoon', 
        image: 'images/raccoon.png',
        happyImage: 'images/raccoon_happy.png',
        sadImage: 'images/raccoon_sad.png'
    },
    { 
        id: 'tanuki', 
        image: 'images/tanuki.png',
        happyImage: 'images/tanuki_happy.png',
        sadImage: 'images/tanuki_sad.png'
    },
    { 
        id: 'redpanda', 
        image: 'images/redpanda.png',
        happyImage: 'images/redpanda_happy.png',
        sadImage: 'images/redpanda_sad.png'
    }
];

let currentAnimal;
let score = 0;
let timeLeft = 30;
let gameTimer;
let canAnswer = true;

function startGame() {
    score = 0;
    timeLeft = 30;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('result').classList.add('hidden');
    canAnswer = true;
    
    showRandomAnimal();
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function showRandomAnimal() {
    const img = document.getElementById('animal-image');
    img.style.opacity = '0';
    canAnswer = false;
    
    setTimeout(() => {
        currentAnimal = animals[Math.floor(Math.random() * animals.length)];
        img.src = currentAnimal.image;
        img.style.opacity = '1';
        canAnswer = true;
    }, 200);
}

function showReactionAndProceed(isCorrect) {
    const img = document.getElementById('animal-image');
    img.src = isCorrect ? currentAnimal.happyImage : currentAnimal.sadImage;
    
    setTimeout(() => {
        showRandomAnimal();
    }, 400);
}

function checkAnswer(answer) {
    if (!canAnswer) return;
    
    canAnswer = false;
    const isCorrect = answer === currentAnimal.id;
    
    if (isCorrect) {
        score += 100;
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = score;
        scoreElement.parentElement.classList.add('score-pop');
        setTimeout(() => {
            scoreElement.parentElement.classList.remove('score-pop');
        }, 200);
    }
    
    showReactionAndProceed(isCorrect);
}

function endGame() {
    clearInterval(gameTimer);
    document.getElementById('final-score').textContent = score;
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
    
    const message = document.createElement('p');
    if (score >= 1500) {
        message.textContent = "すごい！たぬきマスターだね！";
    } else if (score >= 1000) {
        message.textContent = "なかなかの動物博士！";
    } else if (score >= 500) {
        message.textContent = "その調子！もう一度チャレンジ！";
    } else {
        message.textContent = "どんどん練習しよう！";
    }
    
    const existingMessage = resultDiv.querySelector('.result-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    message.classList.add('result-message');
    resultDiv.insertBefore(message, resultDiv.querySelector('button'));
}

window.onload = startGame;