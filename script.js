const startBtn = document.querySelector(".game__start-button");
const firstColumn = document.querySelector(".game__column1");
const secondColumn = document.querySelector(".game__column2");
const thirdColumn = document.querySelector(".game__column3");
const gameInputContainer = document.querySelector(".game__input-container");
const gameInput = document.querySelector(".game__input");
const scoreEl = document.querySelector(".game__player-score");
const timerEl = document.querySelector(".game__timer");
const gameResultEl = document.querySelector(".game-result");
const finalMessageEl = document.querySelector(".game-result__final-message");
const replayBtn = document.querySelector(".replay-btn");
const surrenderBtn = document.querySelector(".game__surrender-button");

class App {
  #entries = [
    {team: "PSG", name: "Kylian Mbappe", nationality: "France"},
    {team: "Manchester City", name: "Erling Haaland", nationality: "Norway"},
    {team: "Real Madrid", name: "Vinicius Junior", nationality: "Brazil"},
    {team: "Manchester City", name: "Phil Foden", nationality: "England"},
    {team: "Liverpool", name: "Mohamed Salah", nationality: "Egypt"},
    {team: "Tottenham", name: "Harry Kane", nationality: "England"},
    {team: "Juventus", name: "Dusan Vlahovic", nationality: "Serbia"},
    {team: "Manchester United", name: "Bruno Fernandes", nationality: "Portugal"},
    {team: "Manchester City", name: "Kevin de Bruyne", nationality: "Belgium"},
    {team: "Barcelona", name: "Pedri", nationality: "Spain"},
    {team: "Borussia Dortmund", name: "Jude Bellingham", nationality: "England"},
    {team: "West Ham United", name: "Declan rice", nationality: "England"},
    {team: "Manchester City", name: "Rodri", nationality: "Spain"},
    {team: "RB Leipzig", name: "Cristopher Nkunku", nationality: "France"},
    {team: "Liverpool", name: "Trent Alexander Arnold", nationality: "England"},
    {team: "Manchester City", name: "Bernardo Silva", nationality: "Portugal"},
    {team: "Bayern Munchen", name: "Joshua Kimmich", nationality: "Germany"},
    {team: "Inter Milan", name: "Lautaro Martinez", nationality: "Argentina"},
    {team: "Manchester United", name: "Jadon Sancho", nationality: "England"},
    {team: "Chelsea", name: "Mason Mount", nationality: "England"},
    {team: "Manchester City", name: "Ruben Dias", nationality: "Portugal"},
    {team: "Tottenham", name: "Heung Min Son", nationality: "South Korea"},
    {team: "PSG", name: "Neymar", nationality: "Brazil"},
    {team: "Bayer 04 Leverkusen", name: "Florian Wirtz", nationality: "Germany"},
    {team: "Atletico Madrid", name: "Joao Felix", nationality: "Portugal"},
  ];

  #players=[];
  #cells;
  #score=0;
  #interval;
  #totalTime = 600;

  constructor(){
    startBtn.addEventListener("click", this._initgame.bind(this));
    
    this.#entries.forEach(entry => {
      this.#players.push (entry.name);
    })
  }

  _initgame(){
    startBtn.classList.add("hidden");
    gameInputContainer.classList.remove("hidden");
    this._renderTable();
    gameInput.addEventListener("keyup", this._checkInput.bind(this));
    this._startTimer();
    window.scrollTo(0, 500);
    
    let self = this;
    prepareGiveUpBtn();


    function prepareGiveUpBtn(){
      setTimeout( () => {
        surrenderBtn.classList.remove("hidden");
      }, 10000);
      surrenderBtn.addEventListener("click", self._endGame.bind(this, "lose"));
    }
  }

  _renderTable(){
   
    firstColumn.innerHTML = secondColumn.innerHTML = thirdColumn.innerHTML = "";

    for(let i=0; i<this.#entries.length; i++)
    {
      const cell1 = document.createElement("div");
      cell1.innerHTML = `
        <p class="cell__team">${this.#entries[i].team}</p>
      `;
      firstColumn.appendChild(cell1);

      const cell2 = document.createElement("div");
      cell2.innerHTML = `
        <p class="cell__name invisible">${this.#entries[i].name}</p>
      `;
      secondColumn.appendChild(cell2);

      const cell3 = document.createElement("div");
      cell3.innerHTML = `
        <p class="cell__nationality">${this.#entries[i].nationality}</p>
      `;
      thirdColumn.appendChild(cell3);
    }
    this.#cells = document.querySelectorAll(".cell__name");
    
  }

  _checkInput(e){
    let inputName = e.target.value;
    let answer = check.call(this, inputName);
    if(answer){
      for(let i=0; i<this.#cells.length; i++){
        if(this.#cells[i].textContent === answer)
        {
          if(this.#cells[i].classList.contains("invisible"))
          {
            this.#cells[i].classList.remove("invisible");
            gameInput.value = "";
            this.#score += 4;
            this._updateScore(this.#score);
            return;
          }
        }  
      }
    }

    function check(inputName){
      for(let i=0; i<this.#players.length; i++){
        let playerFromArray = this.#players[i];
        let arrayPlayerNames = playerFromArray.split(" ").join(",").split("-").join(",").split(",");
        let arrayInputNames = inputName.split(" ").join(",").split("-").join(",").split(",");
        let match;
        if(inputName.length >=3) {
          match = compare(arrayPlayerNames, arrayInputNames[arrayInputNames.length-1]);
        }
        if(match) {
          return this.#players[i];
        }
        
      }
    }

    function compare(arrayPlayerNames, inputName){
      for(let i=0; i<arrayPlayerNames.length; i++)
      {
        inputName = inputName.toLowerCase();
      
        if(inputName.includes(arrayPlayerNames[i].toLowerCase())){
          if(inputName === arrayPlayerNames[i].toLowerCase()){
            return true;
          }
        }
      }
    }
  };

  _updateScore(score){
    scoreEl.textContent = score;
    if(score === 100){
      this._endGame("win");
    }
  }

  _startTimer(){
    clearInterval(this.#interval);
    
    this.#interval = setInterval(function()
    {
      this.#totalTime--;
      setTimer(this.#totalTime);
      if(this.#totalTime === 0){
        this._endGame("lose");
      }
    }.bind(this), 1000); 
    // the line above with "bind" is the reason i have to use location.reload when restarting the game
    
    function setTimer(totalTime){
      let minutes = Math.trunc(totalTime / 60);
      let seconds = totalTime % 60;
      timerEl.textContent = `${minutes}:${seconds<10 ? "0" + seconds : seconds}`
    }
  }

  _endGame(result){
    gameResultEl.classList.remove("hidden");
    gameResultEl.classList.add(`${result === "win" ? "game-result__win" : "game-result__lose"}`);
    gameResultEl.textContent = `${result === "win" ? "You WON!" : "Game over"}`;
  
    clearInterval(this.#interval);
  

    showFinalMessage(this.#score);

  
    replayBtn.classList.remove("hidden");
    
    window.scrollTo({
      top: 500,
      left: 0,
      behavior: 'smooth'
    });

    surrenderBtn.classList.add("hidden");
    gameInput.blur();
    gameInput.style.pointerEvents = "none";

    replayBtn.addEventListener("click", this._restartGame.bind(this))

    for(let i=0; i<this.#cells.length; i++){
      this.#cells[i].classList.remove("invisible");
    }


    function showFinalMessage(score){
      if(score <= 10){
        finalMessageEl.textContent = "At least we know you didn't cheat";
      }
      else if(score <= 40){
        finalMessageEl.textContent = "Not bad for an amateur";
      }
      else if(score <= 70){
        finalMessageEl.textContent = "Now that's some fine knowledge";
      }
      else if(score <= 99){
        finalMessageEl.textContent = "Man, take a break and go outside sometimes";
      }
      else if(score === 100){
        finalMessageEl.textContent = "You're a LEGEND!";
      }
    }
  }

  _restartGame(){
    location.reload();
  }

}

const app = new App();


