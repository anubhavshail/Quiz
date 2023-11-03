const question = document.getElementById("ques-container");
const choices = document.getElementById("choice-container");
const nextButton = document.getElementById("next-button");
const result = document.getElementById("result");


let score = 0;
let currentQuestion = 0;
let quizData = [];
let timer;
let startTime;

function startQuiz() {
    startTime = Date.now();
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            quizData = shuffle(data);
            console.log(quizData);
            showQuestion();
        })
        .catch(error => console.error(error));

    nextButton.addEventListener("click", ()=>{
        clearInterval(timer);
        currentQuestion++;
        if(currentQuestion < quizData.length){
            showQuestion();
        }
        else{
            endQuiz();
            clearInterval(timer);
        }
    })
}

//function to shuffle the array of data Knuth algo
function shuffle(array) {
    let currentIndex = array.length, temp, randomIndex;
    
    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}
//function to show questions
function showQuestion(){
    const quiz = quizData[currentQuestion];
    question.innerHTML = quiz.question;
    choices.innerHTML = " ";
    startTimer();

    const bar = document.querySelector(".time-bar");
    bar.classList.remove("time-bar");
    bar.offsetWidth;
    bar.classList.add("time-bar");

    quiz.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", ()=> checkAnswer(option)); 
        choices.appendChild(button);
    });
}

//function to check answer
function checkAnswer(answer){
    const quiz = quizData[currentQuestion];
    if(answer === quiz.answer){
        score++;
    }
    
    const buttons = document.querySelectorAll("#choice-container button");
    buttons.forEach(button =>{
        button.disabled = true;
    })
    clearInterval(timer);

    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = ((currentQuestion + 1)/ quizData.length)* 100 + "%";
}

//function to set the timer for each question 
function startTimer() {
    let time = 10;
    timer = setInterval(() => {
        time--;
        if(time < 0){
            checkAnswer("");
            currentQuestion++;
            if(currentQuestion < quizData.length) {
                showQuestion();
            }
            else{ 
                endQuiz();
            }
        }
    }, 1000);

}

function endQuiz(){
    const endTime = Date.now();
    const totalTime = (endTime - startTime)/1000;
    question.innerHTML = "Quiz Finised";
    choices.innerHTML = " ";
    result.innerHTML = "Your score is " + score + " out of " + quizData.length + ". Total time taken: " + totalTime + " seconds.";
    nextButton.style.display = "none";

}

startQuiz();

