'use strict'

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_DURATION_SEC = 20;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpText = document.querySelector('.pop-up__message');

const carrotSound = new Audio('sound/carrot_pull.mp3');
const alertSound = new Audio('sound/alert.wav');
const bgSound = new Audio('sound/bg.mp3');
const bugSound = new Audio('sound/bug_pull.mp3');
const winSound = new Audio('sound/game_win.mp3')

const sunyeop = document.querySelector('.sunyeop');


let started = false;
let score = 0;
let timer = undefined




//field.addEventListener('click', (event)=>onFieledClick(event));
field.addEventListener('click', onFieledClick); //위와 동일함

gameBtn.addEventListener('click', ()=>{
   if(started){
    stopGame();
   }else{
    startGame();
   }  
})

popUpRefresh.addEventListener('click', ()=>{
    startGame();
    hidePopUp();
})

function startGame(){
    started = true;    
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopupWithText('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win){
    started = false;    
    hideGameButton();
    stopGame();
    if(win){
        sunyeop.classList.remove('sunyeop__hide');
        playSound(winSound)        
    }else{
        sunyeop.classList.add('sunyeop__hide');
        playSound(bugSound)
    }
    showPopupWithText(win? 'YOU WON' : 'YOU LOST');
}

function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible';
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}

function startGameTimer(){
    let remainTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainTimeSec);
    timer = setInterval(() => {
        if(remainTimeSec <= 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainTimeSec);
    }, 1000);
}

function stopGameTimer(){
    clearInterval(timer);
}



function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopupWithText(text){
    popUpText.innerText = text;
    popUp.classList.remove('pop-up__hide');
}

function hidePopUp(){
     popUp.classList.add('pop-up__hide');
    // popUp.style.visibility = 'hidden';
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}


function initGame(){
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = CARROT_COUNT;
    // 벌레와 당근을 생성한뒤 field에 추가해줌
    // console.log(fieldRect);
    addItem('carrot', CARROT_COUNT, 'img/carrot.png');
    addItem('bug', BUG_COUNT, 'img/bug.png')
}

function onFieledClick(event){   
    if(!started){
        return;
    }
    // console.log(event.target);
    const target = event.target;
    if(target.matches('.carrot')){
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBorad();
        if(score === CARROT_COUNT){
            finishGame(true)
        }
    }else if(target.matches('.bug')){
        stopGameTimer();
        finishGame(false);
    }
}

function playSound(sound){
    sound.currentTime = 0;
    sound && sound.play();
}

function stopSound(sound){
    sound && sound.pause();
}


function updateScoreBorad(){
    gameScore.innerText = CARROT_COUNT - score;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  

function addItem(className, count, imgPath){

    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;

    for(let i = 0; i<count; i++){
        
        const item = document.createElement('img');
        item.setAttribute('src', imgPath);
        item.setAttribute('class', className);
        item.style.position = 'absolute';
        const x = getRandomNumber(x1, x2);
        const y = getRandomNumber(y1, y2);         
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        
        field.appendChild(item);
    }

    
}
