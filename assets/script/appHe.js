const lang = document.documentElement.lang;
console.log(lang);
const restart = document.createElement('button');
const gameArea = document.getElementById("gameArea");
const btn = document.createElement("button");
const header = document.getElementById("main-title-wrap");
const output = document.createElement('div');
const inputWord = document.createElement('input');
const scoreBoard = document.getElementById('scoreBoard');
const yourScore = document.querySelector('.yourScore');
const score = document.querySelector('.score');



function gameStart() {

    //creating the elements
    btn.classList.add("btn", "btn-primary", "btn-lg");

    let textContent = "התחלת משחק חדש!";
    btn.innerHTML = (`${textContent} <i class="far fa-play-circle"></i>`);

    output.classList.add("output");


    inputWord.setAttribute("type", "text");
    inputWord.classList.add("form-control");
    inputWord.style.display = "none";



    //Add elements to the Doc
    gameArea.prepend(scoreBoard);
    gameArea.append(output);
    gameArea.append(inputWord);
    gameArea.append(btn);
}


//game start values


const myWords = ["ציפור", "עגבניה", "תפוח עץ"]; // min 3 char

const game = {
    sel: '',
    scrambled: '',
    score: 0,
    incorrect: 0,
    wordsLeft: 0,
    gameOver: false,
    played: myWords.length

};
//Event Listeners

btn.addEventListener('click', (e) => {

    console.log(game.wordsLeft);
    header.style.display = "none";
    inputWord.style.display = "block";
    inputWord.value = "";
    inputWord.disabled = false;
    btn.style.display = "none";
    // hide the button on game start

    scoreBoard.classList.remove("alert-danger", "alert-success");
    inputWord.focus();
    //select random word form the arry
    myWords.sort(() => {
        return 0.5 - Math.random()
    });
    game.sel = myWords.shift();
    game.wordsLeft = myWords.length;

    let temp = game.sel.split("");
    temp.sort(() => {
        return 0.5 - Math.random()
    });
    temp = temp.join("");
    game.scrambled = sorter(game.sel);
    inputWord.setAttribute('maxlength', game.sel.length); //input word not longer than the chosen word
    output.textContent = `${game.scrambled}`;
    console.log(game.scrambled);
});

inputWord.addEventListener('keyup', (e) => {
    //    console.log(e);
    if (inputWord.value.length == game.sel.length || e.code == "Enter") {
        // check the words
        console.log("checking the word");
        winChecker();
    }
})

//Helpers
// Function to check if the word is scrambeld
function sorter(val) {
    let temp = game.sel.split('');
    temp.sort(() => {
        return 0.5 - Math.random()
    });
    temp = temp.join("");
    if (val === temp) {

        return sorter(val);

    } else {

        return temp;
    }
}

function winChecker() {
    scoreBoard.style.display = "block";
    if (inputWord.value == game.sel) {
        console.log("correct");
        inputWord.style.borderColor = "green";
        inputWord.style.borderWidth = "3px";
        inputWord.disabled = true;
        btn.style.display = "block";
        textContent = "המילה הבאה"
        btn.innerHTML = `<i class="far fa-hand-point-left"></i> ${textContent}`;
        scoreBoard.classList.remove("alert-danger");
        scoreBoard.classList.add("alert-success");
        game.score++;
        if (game.wordsLeft <= 0) {
            gameOver();
        }
    } else {
        inputWord.style.borderColor = "red";
        inputWord.style.borderWidth = "3px";
        scoreBoard.classList.remove("alert-danger");
        scoreBoard.classList.add("alert-danger");
        console.log("Wrong");
        game.incorrect++;
    }
    addScore();
}

function addScore() {
    let tempOutput = `תשובות נכונות <strong>${game.score}</strong>, תשובות לא נכונות <i>${game.incorrect}</i>, <small>עוד ${game.wordsLeft} מילים לסיום</small>`;
    yourScore.innerHTML = tempOutput;
    score.innerHTML = game.score;
}

function gameOver() {
    game.gameOver = true;
    console.log('game over');
    let alert = "danger";
    let msg;
    if (game.score > game.incorrect) {
        alert = "success";
        msg = "מצויין";

    } else if (game.score < game.incorrect) {
        alert = "danger";
        msg = "אתם יכולים יותר טוב. נסו שוב";
    } else if (game.score == game.incorrect) {
        alert = "warning";
        msg = "כל הכבוד";
    }
    // gameArea.append(msg);
    gameArea.innerHTML = `<div id="gameOverMsg" class="alert alert-${alert}">${msg}<i class="fas fa-trophy"></i><h3>יש לך ${game.score} תשובות נכונות ו- ${game.incorrect} תשובות לא נכונות מתוך ${game.played} מילים</h3></div>`;
    restart.classList.add("btn", "btn-info", "btn-lg", "restart-btn");
    textContent = "שחקו שוב";
    restart.innerHTML = `${textContent} <i class="fas fa-redo"></i>`;
    gameArea.append(restart);
}

gameStart();

restart.addEventListener('click', () => {
    window.location.reload();
});