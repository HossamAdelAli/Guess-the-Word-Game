// Set Main Variables
// Set game name
const gameName =  "Guess The Word";
document.title = gameName;
document.querySelector(".game-name").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created by "Hossam Adel"`;
// Set Game Options
let NumberOfTries = 5;
let NumberOfInputs = 6;
let NumberOfHints = 2;
let CurrentTry = 1;
// Select Elements From HTML
let inputContainer = document.querySelector(".inputs");
let message = document.querySelector(".result")
// Set Words Array & Loop through the words and choose a random word
let wordToGuess = "";
const Words = ["Hossam","Khaled","Sallam","Ismail","Jomana","Nasser","Roqaia","Mosaad","Somaia","Kareem","Yasmin","Yassin","Makram","Hassan","Yousef","sherif","Khalil","Bassem","Shaima","Mahran"];
wordToGuess = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
// Generate Inputs
function CreateInput () {
    // Select Input Div
    // Create NumberOfTries Div
    for (let i = 1; i <= NumberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add("disabled-inputs");
        // Create NumberOfInputs Div
        for (let j = 1; j <= NumberOfInputs; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `try-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputContainer.appendChild(tryDiv);
    }
    // Focus on the first input element
    inputContainer.children[0].children[1].focus();
    // console.log(inputContainer.children[1].children[1]);
    // Disable All input elements except the first one
    const disabledInputs = document.querySelectorAll(".disabled-inputs input");
    disabledInputs.forEach((input) => input.disabled = true);
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index)  => {
        // Convert the input letter to upper case
        input.addEventListener("input", function() {
            this.value = this.value.toUpperCase();
            // Focus on the Next input element
            const nextInput = inputs [index + 1];
            if (nextInput) nextInput.focus();
        });
        
        // Move inside inputs by keyboard
        input.addEventListener("keydown", function (event) {
            const CurrentInput = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextInput = CurrentInput + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus()
            }
            if (event.key === "ArrowLeft") {
                const prevInput = CurrentInput - 1;
                if (prevInput >= 0) inputs[prevInput].focus()
        }
            if (event.key === "Backspace") {
                const inputs = document.querySelectorAll("input:not([disabled])");
                const currentIndex = Array.from(inputs).indexOf(document.activeElement);
                const CurrentInput = inputs[currentIndex]
                const prevInput = inputs[currentIndex -1];
                // console.log(currentIndex);
                if (currentIndex)  {
                    CurrentInput.value = ""
                    prevInput.focus()
                    prevInput.value = ""
                }
            }
        })
    })
}
console.log(wordToGuess);
// Game Logic
// Select Buttons From HTML
const checkButton = document.querySelector(".check")
const hintButton = document.querySelector(".hint");
// Manage check word button
checkButton.addEventListener("click", handleGuesses);
function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= NumberOfInputs; i++) {
        const inputField = document.querySelector(`#try-${CurrentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
    // Check if the letter is Correct or not
    if (letter === actualLetter) {
        // Letter is Correct And In Place
        inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
        // Letter is Correct but not In Place
        inputField.classList.add("not-in-place");
        successGuess = false;
    } else {
        inputField.classList.add("no");
        // Letter is Wrong
        successGuess = false;
    }
    }
    // Check if user win or lost
    // If You Win
    if (successGuess) {
        message.innerHTML = `Congrats! You Won! The Word is <span>${wordToGuess}</span>`;
        // Disable All Div's
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        // Disable Check Button
        checkButton.disabled = true;
        hintButton.disabled = true
        // Refresh The Page To Restart The Game
        setTimeout(function(){
            window.location.reload();
        }, 5000);
    } else {
        // If You Lose And Yoy Will try Again
        message.innerHTML = `Please Try Again`
        document.querySelector(`.try-${CurrentTry}`).classList.add("disabled-inputs");
        const CurrentTryInputs = document.querySelectorAll(`.try-${CurrentTry} input`);
        CurrentTryInputs.forEach((input) => input.disabled = true);
        // Move To The Next Try "from try-1 to try-2 ==>"
        CurrentTry++;
        const nextTryInput = document.querySelectorAll(`.try-${CurrentTry} input`);
        nextTryInput.forEach((input) => input.disabled = false);
        let el = document.querySelector(`.try-${CurrentTry}`);
        if (el) {
            el.classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // If You Lost
            message.innerHTML = `You Lost Game Over! The Word Is <span>${wordToGuess}</span>`;
            // Disable Check Button
            checkButton.disabled = true;
            hintButton.disabled = true
            // Refresh The Page To Restart The Game
            setTimeout(function(){
                window.location.reload();
            }, 5000);
        }
        }
    }
// Manage Hints & Hint button
document.querySelector(".hint span").innerHTML = NumberOfHints;
hintButton.addEventListener("click" , getHint);
function getHint() {
    if (NumberOfHints > 0) {
        NumberOfHints --; 
        document.querySelector(".hint span").innerHTML = NumberOfHints;
    } if (NumberOfHints === 0) {
        message.innerHTML = `You Have No More Hints`
        hintButton.disabled = true
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    // console.log(enabledInputs);
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);
    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomEmptyInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomEmptyInput);
        if (indexToFill  !== -1){
            randomEmptyInput.focus();
            randomEmptyInput.value = wordToGuess[indexToFill].toUpperCase();
        }             
    }

}
window.onload = function() {
    CreateInput ()
}

