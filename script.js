const animals = [
    { 
        id: 'raccoon', 
        image: 'images/raccoon.png',        // 通常表情
        happyImage: 'images/raccoon_happy.png',    // 笑顔
        sadImage: 'images/raccoon_sad.png'         // 悲しい顔
    },
    { 
        id: 'tanuki', 
        image: 'images/tanuki.png',         // 通常表情
        happyImage: 'images/tanuki_happy.png',     // 笑顔
        sadImage: 'images/tanuki_sad.png'          // 悲しい顔
    },
    { 
        id: 'redpanda', 
        image: 'images/redpanda.png',       // 通常表情
        happyImage: 'images/redpanda_happy.png',   // 笑顔
        sadImage: 'images/redpanda_sad.png'        // 悲しい顔
    }
];

const polarBear = {
    id: 'polarbear',
    image: 'images/polarbear.png',          // 通常表情
    angryImage: 'images/polarbear_angry.png'      // 怒った顔
};

let currentAnimal;
let score = 0;
let timeLeft = 30;
let gameTimer;
let canAnswer = true;
let isGameActive = false;
let mistakeCount = 0;
const MAX_MISTAKES = 5;
const MAX_RANKING_ENTRIES = 10;

// ローカルストレージからランキングを取得する関数
function getRanking() {
    const ranking = localStorage.getItem('ponpokoRanking');
    return ranking ? JSON.parse(ranking) : [];
}

// ランキングを保存する関数
function saveRanking(ranking) {
    localStorage.setItem('ponpokoRanking', JSON.stringify(ranking));
}

// スコアを登録する関数
function submitScore() {
    const playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('なまえを入れてね！');
        return;
    }

    const ranking = getRanking();
    ranking.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
    });

    // スコアで降順ソート
    ranking.sort((a, b) => b.score - a.score);
    
    // 上位10件のみ保持
    if (ranking.length > MAX_RANKING_ENTRIES) {
        ranking.length = MAX_RANKING_ENTRIES;
    }

    saveRanking(ranking);
    showRanking();
}

// ランキングを表示する関数
function showRanking() {
    const ranking = getRanking();
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    ranking.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <span class="ranking-position">${index + 1}位</span>
            <span class="ranking-name">${entry.name}</span>
            <span class="ranking-score">${entry.score}てん</span>
        `;
        rankingList.appendChild(item);
    });

    // 画面の切り替え
    hideAllScreens();
    document.getElementById('ranking-screen').classList.remove('hidden');
}

// タイトルに戻る関数
function returnToTitle() {
    hideAllScreens();
    document.getElementById('start-screen').classList.remove('hidden');
}

// 全画面を非表示にする関数
function hideAllScreens() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('ranking-screen').classList.add('hidden');
}

// シロクマ表示とゲームオーバー
function showPolarBearAndEnd() {
    const img = document.getElementById('animal-image');
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = polarBear.image;
        img.style.opacity = '1';
        
        setTimeout(() => {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = polarBear.angryImage;
                img.style.opacity = '1';
                setTimeout(() => {
                    endGame(true);
                }, 500);
            }, 100);
        }, 500);
    }, 100);
}

// ゲーム開始関数
function startGame() {
    hideAllScreens();
    document.getElementById('game-screen').classList.remove('hidden');
    
    score = 0;
    timeLeft = 30;
    mistakeCount = 0;
    isGameActive = true;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('mistakes').textContent = mistakeCount;
    canAnswer = true;
    
    showRandomAnimal();
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// ランダムな動物を表示する関数
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

// リアクションを表示して次の動物を表示する関数
function showReactionAndProceed(isCorrect) {
    const img = document.getElementById('animal-image');
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = isCorrect ? currentAnimal.happyImage : currentAnimal.sadImage;
        img.style.opacity = '1';
        
        setTimeout(() => {
            if (isGameActive) {
                showRandomAnimal();
            }
        }, 300);
    }, 100);
}

// 回答をチェックする関数
function checkAnswer(answer) {
    if (!canAnswer || !isGameActive) return;
    
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
    } else {
        mistakeCount++;
        document.getElementById('mistakes').textContent = mistakeCount;
        document.querySelector('.mistakes').classList.add('mistake-animation');
        setTimeout(() => {
            document.querySelector('.mistakes').classList.remove('mistake-animation');
        }, 500);

        if (mistakeCount >= MAX_MISTAKES) {
            showPolarBearAndEnd();
            return;
        }
    }
    
    showReactionAndProceed(isCorrect);
}

// ゲーム終了関数
function endGame(isPolarBearEnd = false) {
    isGameActive = false;
    clearInterval(gameTimer);
    document.getElementById('final-score').textContent = score;
    
    hideAllScreens();
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
    
    const message = document.createElement('p');
    if (isPolarBearEnd) {
        message.textContent = "シロクマに怒られちゃった！もっと慎重に答えよう！";
    } else if (score >= 1500) {
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

// イベントリスナーの設定
window.onload = function() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('ranking-button').addEventListener('click', showRanking);
    returnToTitle(); // 初期画面の表示
};