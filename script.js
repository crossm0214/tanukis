// リアクションを表示して次の動物を表示する関数を修正
function showReactionAndProceed(isCorrect) {
    const img = document.getElementById('animal-image');
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = isCorrect ? currentAnimal.happyImage : currentAnimal.sadImage;
        img.style.opacity = '1';
        
        setTimeout(() => {
            if (isGameActive) {  // ゲームが続いている場合のみ次の動物を表示
                showRandomAnimal();
            }
        }, 800);  // リアクションを見せる時間を長くする
    }, 200);
}

// checkAnswer関数も少し修正
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

// showPolarBearAndEnd関数も修正
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
                }, 1000);
            }, 200);
        }, 1000);
    }, 200);
}
