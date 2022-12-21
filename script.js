class AudioController {
    constructor(){
        this.bgMusic = new Audio("Assets/Audio/creepy.mp3")
        this.flipSound = new Audio("Assets/Audio/flip.wav")
        this.matchSound = new Audio("Assets/Audio/match.wav")
        this.victorySound = new Audio("Assets/Audio/victory.wav")
        this.gameOverSound = new Audio("Assets/Audio/gameover.wav")
        this.bgMusic.volume = 0.3
        this.bgMusic.loop = true
    }
    startMusic(){
        this.bgMusic.play()
    }
    stopMusic(){
        this.bgMusic.pause()
        this.bgMusic.currentTime = 0
    }
    flip(){
        this.flipSound.play()
    }
    match(){
        this.matchSound.play()
    }
    victory(){
        this.stopMusic()
        this.victorySound.play()
    }
    gameOver(){
        this.stopMusic()
        this.gameOverSound.play()
    }
} 
class MixOrMatch {
    constructor(totalTime ,cards){
        this.cardsArray = cards
        this.totalTime  = totalTime
        this.timeRemaining = totalTime
        this.timer = document.getElementById("time-remaining")
        this.ticker = document.getElementById("flips")
        this.audioController = new AudioController() 
    }

    startGame(){
        this.cardToCheck = null
        this.totalClicks = 0
        this.timeRemaining = this.totalTime
        this.matchedCards = []
        this.busy = true 
        setTimeout(()=>{
            this.audioController.startMusic()
            this.shuffleCards()
            this.countDown = this.startCountDown()
            this.busy = false 
        },"500")
        this.hideCards()
        this.timer.innerText = this.timeRemaining
        this.ticker.innerText = this.totalClicks
    }

    hideCards(){
        this.cardsArray.forEach(card=>{
            card.classList.remove("visible")
            card.classList.remove("matched")
        })
    }
    
    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip()
            this.totalClicks++ 
            this.ticker.innerText = this.totalClicks
            card.classList.add("visible") 
            if(this.cardToCheck){
                this.checkForCardMatch(card)
            }else{
                this.cardToCheck  = card
            }
        } 

    }
    
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.canCardMatch(card,this.cardToCheck)
        }else{
            this.canMisMatch(card,this.cardToCheck)
        }
        this.cardToCheck =  null
    }

    canCardMatch(card1,card2){
        this.matchedCards.push(card1 )        
        this.matchedCards.push(card2)
        setTimeout(()=>{
            card1.classList.add("matched")
            card2.classList.add("matched")
            this.busy = false
        },"1000")
        this.audioController.match()
        if(this.matchedCards.length === this.cardsArray.length){
            this.victory()
        }
    }
    canMisMatch(card1,card2){
        this.busy = true 
        setTimeout(()=>{
            card2.classList.remove("visible")
            card1.classList.remove("visible")
            this.busy = false
        },"1000")
    }
    getCardType(card){
        return card.getElementsByClassName("card-value")[0].src
    }

    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--
            this.timer.innerText  = this.timeRemaining
            if(this.timeRemaining === 0){
                this.gameOver()
            }
        },1000)
    }
    
    gameOver(){
        clearInterval(this.countDown)
        this.audioController.gameOver()
        document.getElementById("game-over-text").classList.add("visible")
    }

    victory(){
        clearInterval(this.countDown)
        this.audioController.victory()
        let  victoryText= document.getElementById("victory-text")
        victoryText.classList.add("visible")
    }
    
    shuffleCards(){
        for (let i = 0; i < this.cardsArray.length; i++) {
            let randomIndex = Math.floor(Math.random() * (i+1))
            this.cardsArray[randomIndex].style.order= i
            this.cardsArray[i].style.order= randomIndex
        }
    }
    
    canFlipCard(card){    
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck
    }
}

function ready(){
    let overlays  = Array.from(document.getElementsByClassName("overlay-text"))
    let cards = Array.from(document.getElementsByClassName("card"))
    let game = new MixOrMatch(100 , cards)
    overlays.forEach(overlay=>{
        overlay.addEventListener("click",()=>{
            overlay.classList.remove("visible")
            game.startGame()
        })
    })
    cards.forEach(card =>{
        card.addEventListener("click",()=>{
            game.flipCard(card)
        })
    })
}

if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",ready());
}else{
    ready()
}
