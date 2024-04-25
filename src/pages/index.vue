<template>
<div class="main">
  <div class="main__score-block">
    <p>Score : {{score.toFixed(1)}}</p>
  </div>
  <div class="main__game-block">
    <div class="game-block__game-apartments">
<!--      PERSON-->
      <div id="person-block" class="game-apartments__person-block">
        <img
            id="person"
            class="person-block__person"
            :src="personGif"
            alt="person">
      </div>
<!--      ITEMS-->
      <div id="itemsBlock" class="game-apartments__items-block">
      </div>
    </div>
  </div>
<!--  START BTN-->
  <div class="main__start-btn-block" v-if="isShowStartModal">
    <button class="start-btn-block__btn" @click="onStartGameFunc">START</button>
  </div>
</div>
<!--  LOSE MODAL-->
  <div class="modal-content" v-if="isShowLoseModal">
    <div class="modal-content__modal-body">
      <div class="modal-body__modal-title">
        <p class="modal-title__text">You are lose</p>
      </div>
      <div class="modal-body__body">
        <div class="body__score-text">
          <p>Your score: {{ score.toFixed(0) }}</p>
        </div>
        <div class="body__try-button">
          <button class="try-button__button" @click="onTryAgainFunc">Try Again</button>
        </div>
      </div>
      <div class="modal-body__footer"></div>
    </div>
  </div>
  <audio id="coinAudio">
    <source src="../assets/audio/coin.mp3">
  </audio>
  <audio id="loseAudio">
    <source src="../assets/audio/lose.mp3">
  </audio>
  <audio id="runningAudio" loop>
    <source src="../assets/audio/running.mp3">
  </audio>
</template>

<script setup>
import { onMounted, ref } from "vue";
import personImageUrl from '../assets/images/personStop.png'
import personGifUrl from '../assets/images/person.gif'
import cactusImg from '../assets/images/cactus-r.png'
import snakeGif from '../assets/images/snake.gif'
import coinImg from '../assets/images/coin.png'

let isShowStartModal = ref(true);
let isShowLoseModal = ref(false);
let personGif = ref(personImageUrl);
let items = ref([cactusImg, snakeGif]);
let score = ref(0);
let coinImage = ref(coinImg)


onMounted(() => {
  document.addEventListener('keypress', (e) => {
    if(e.code === "Space") {
      onUpPersonFunc()
    }
  })
  document.addEventListener("touchstart", (e) => {
    if(!isShowStartModal.value) onUpPersonFunc()
  })
})
function onLoseGameFunc() {
  isShowLoseModal.value = true;
  let itemsBlock = document.getElementById('itemsBlock');
  let loseAudio = document.getElementById('loseAudio');
  let runningAudio = document.getElementById('runningAudio');
  loseAudio.play()
  runningAudio.pause()
  itemsBlock.style.display = 'none';
  personGif.value = personImageUrl;
}
function onTryAgainFunc() {
  location.reload()
}
function onStartGameFunc() {
  let person = document.getElementById('person');
  let runningAudio = document.getElementById('runningAudio');

  runningAudio.play()
  person.style.zIndex = '15';
  personGif.value = personGifUrl;
  isShowStartModal.value = false;

  onRunItemsBlockFunc();

  // check person position and item position
  let checkedItemId = 1;
  const checkIsLose = setInterval(() => {
    score.value += 0.1;

    let item = document.querySelector(`img[data-id=${CSS.escape(checkedItemId)}]`);

    // If person take coin
    if(item && item.getBoundingClientRect().x < person.getBoundingClientRect().x
        + person.getBoundingClientRect().width - 30 &&
        item.getAttribute('coin')) {
      score.value += 200;
      onTakeCoinFunc(checkedItemId);
      checkedItemId+=1;
    }
    // If person touch on item
    else if(item && item.getBoundingClientRect().x < person.getBoundingClientRect().x + person.getBoundingClientRect().width - 60) {
      if((person.getBoundingClientRect().bottom > item.getBoundingClientRect().top)) {
        clearInterval(checkIsLose)
        onLoseGameFunc();
      } else checkedItemId+=1;
    }
  }, )
}
function onUpPersonFunc() {
  let person = document.getElementById('person')
  person.classList.add('person-animation')
  setTimeout(() => person.classList.remove('person-animation'), 800)
}
function onRunItemsBlockFunc() {
  let itemsBlock = document.getElementById('itemsBlock')
  let itemId = 1;

    // Create new items
   const intervalTimeFunc = (time) => {
     let randomTime = Math.floor(Math.random() * (2000 - 900) + 900);

     setTimeout(() => {
       let randomItems = items.value[Math.ceil(Math.random() * 2)-1]
       let elem = document.createElement('img');
       // Create coin or item
       if(itemId % 7 === 0 || itemId % 5 === 0) {
         elem.setAttribute('src', coinImage.value);
         elem.setAttribute('data-id', `${itemId}`)
         elem.setAttribute('coin', 'true')
       } else {
         elem.setAttribute('src', randomItems +'');
         elem.setAttribute('data-id', `${itemId}`);
       }
       // Items run speed change
       if(score.value < 1000) {
         elem.classList.remove('translate-item-easy');
         elem.classList.add('translate-item-easy')
       }
       else if(score.value > 1000 && score.value < 1800) {
         elem.classList.remove('translate-item-easy');
         elem.classList.add('translate-item-normal');
       }
       else {
         elem.classList.remove('translate-item-normal');
         elem.classList.add('translate-item-hard');
       }
       elem.classList.add('item-image');
       itemId+=1;
       itemsBlock.appendChild(elem);
       intervalTimeFunc(randomTime);
     },time)
   }
   intervalTimeFunc(1000)
}

function onTakeCoinFunc(itemId) {
  let coinAudio = document.getElementById('coinAudio');
  let elem = document.querySelector(`img[data-id=${CSS.escape(itemId)}]`)
  elem.style.display = 'none'
  coinAudio.play()
}


</script>

<style >
.person-animation {
  animation: upPerson 800ms;
}
.translate-item-easy {
  animation: translate 7s linear;
}
.translate-item-normal {
  animation: translate 4s linear;
  animation-delay: 3s;
}
.translate-item-hard {
  animation: translate 2s linear;
  animation-delay: 5s;
}
@keyframes upPerson {
  0% {
  }
  50% {
    transform: translateY(-340px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes translate {
  0% {
    right: -10vw;
  }
  100% {
    right: 150vw;
    display: none;
  }
}

.main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.main__score-block {
  display: flex;
  justify-content: end;
  margin: 20px;
}
.main__start-btn-block {
  position: absolute;
  left: 0;
  background: rgba(0,0,0,0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.start-btn-block__btn {
  padding: 8px 18px;
  background-color: lightgrey;
  border: 1px solid gray;
  border-radius: 8px;
  cursor: pointer;
}
.main__game-block {
  height: 75vh;
  background-image: url("../assets/images/game-bg.jpg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  display: flex;
  align-items: end;
}
.game-block__game-apartments {
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
  position: relative;
}
.game-apartments__person-block {
  position: relative;
  width: 90px;
  height: 110px;
}
.person-block__person {
  position: absolute;
  width: 150px;
  z-index: 0;
  bottom: 0;
}
.game-apartments__items-block {
  display: flex;
  width: 100%;
  align-self: end;
  justify-content: end;
  position: absolute;
  z-index: 15;
  left: 0;
  bottom: 0;
}
.item-image {
  position: absolute ;
  right: -10vw;
  width: 70px;
  bottom: 0;
  z-index: 15;
}

.modal-content {
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0, 0.8);
}
.modal-content__modal-body {
  width: 250px;
  background-color: whitesmoke;
  border-radius: 8px;
}
.modal-body__modal-title {
  padding: 8px 5px;
  border-bottom: 1px solid ;
}
.modal-title__text {
  font-size: 17px;
  font-family: sans-serif;
}
.modal-body__body {
  padding: 10px;
}
.body__try-button {
  display: flex;
  justify-content: end;
}
.try-button__button {
  background-color: lightgrey;
  font-family: sans-serif;
  font-size: 16px;
  border: none;
  box-shadow: 0 0 1px 2px gray;
  border-radius: 5px;
  padding: 8px 5px;
  cursor: pointer;
}

</style>