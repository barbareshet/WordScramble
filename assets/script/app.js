const sheetId = "1bzVQ8I-8CFQKVNexOB3QllS-iaQcrbUHHeHOVV4_eAc";
const lang = document.documentElement.lang;
console.log(lang);
const restart = document.createElement('button');
const gameArea = document.getElementById("gameArea");
const btn = document.createElement("button");
btn.style.display = "none";
const header = document.getElementById("main-title-wrap");
const output = document.createElement('div');
const inputWord = document.createElement('input');
const selectList = document.createElement('select');
selectList.style.display = "none";
selectList.classList.add("custom-select", "custom-select-lg", "mb-3");
const scoreBoard = document.getElementById('scoreBoard');
scoreBoard.style.display = "none";
const yourScore = document.querySelector('.yourScore');
const score = document.querySelector('.score');
const wordsArr = []; //setting up a default empty array to hold the lists
let url = 'https://spreadsheets.google.com/feeds/list/' + sheetId + '/1/public/values?alt=json';
fetch(url)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data); //providein the google sheet object

        // let elem = data.feed.entry[0];//this will provide only the first row of data
        //looping on all rows in the document, to create different lists
        data.feed.entry.forEach((elem, index) => {
                let holder = []; //setting up a default empty array;
                let opt = document.createElement("option");
                console.log(elem.title);
                opt.appendChild(document.createTextNode(elem.title.$t));
                opt.value = index;
                selectList.append(opt);
                for (let key in elem) {
                    // console.log(key); //printing the key name (lookin for gsx key)
                    if (key.substring(0, 3) == 'gsx') {
                        holder.push(elem[key].$t);
                    }
                }
                wordsArr.push(holder)
            })
            // console.log(wordsArr);

        gameStart();
    })

function gameStart() {

    //creating the elements
    btn.classList.add("btn", "btn-primary", "btn-lg");
    btn.style.display = "block";
    scoreBoard.style.display = "block";
    selectList.style.display = "block";

    let textContent = "Start a new game!";
    btn.innerHTML = (`${textContent} <i class="far fa-play-circle"></i>`);

    output.classList.add("output");


    inputWord.setAttribute("type", "text");
    inputWord.classList.add("form-control");
    inputWord.style.display = "none";



    //Add elements to the Doc
    gameArea.prepend(scoreBoard);
    gameArea.append(output);
    gameArea.append(inputWord);
    gameArea.append(selectList);
    gameArea.append(btn);
}


//game start values

let myWords = [];
const game = {
    sel: '',
    scrambled: '',
    score: 0,
    incorrect: 0,
    wordsLeft: 0,
    gameOver: false,
    played: myWords.length,
    playing: false
};
//Event Listeners

btn.addEventListener('click', (e) => {
    if (!game.playing) {
        myWords = wordsArr[selectList.value];
        selectList.style.display = "none";
        header.style.display = "none";
        btn.style.display = "none";
        game.playing = true;
    }
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
        textContent = "Next Word"
        btn.innerHTML = `${textContent} <i class="far fa-hand-point-right"></i>`;
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
    let tempOutput = `Correct answers <strong>${game.score}</strong>, Incorrect answers <i>${game.incorrect}</i>, <small>Words left ${game.wordsLeft}</small>`;
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
        msg = "Great";

    } else if (game.score < game.incorrect) {
        alert = "danger";
        msg = "Better luck next time";
    } else if (game.score == game.incorrect) {
        alert = "warning";
        msg = "You did well";
    }
    // gameArea.append(msg);
    gameArea.innerHTML = `<div id="gameOverMsg" class="alert alert-${alert}">${msg}<i class="fas fa-trophy"></i><h3>You got ${game.score} correct & ${game.incorrect} incorrect answer of ${game.played}</h3></div>`;
    restart.classList.add("btn", "btn-info", "btn-lg", "restart-btn");
    textContent = "Restat";
    restart.innerHTML = `${textContent} <i class="fas fa-redo"></i>`;
    gameArea.append(restart);
}

gameStart();

restart.addEventListener('click', () => {
    window.location.reload();
});