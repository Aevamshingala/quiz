const op_A = document.getElementById("A");
const op_B = document.getElementById("B");
const op_C = document.getElementById("C");
const op_D = document.getElementById("D");
const question = document.getElementById("que");
const clear = document.querySelector(".clear");
const next = document.querySelector(".next");
const error = document.getElementById("error");
let range = document.getElementById("range");
let range2 = document.getElementById("range2");

const start = document.querySelector(".start");
const time = document.getElementById("time");
next.style.pointerEvents = "none";
clear.addEventListener(
  "click",
  () => {
    localStorage.removeItem("apiData");
    // localStorage.clear();
    window.location.href = "index.html";
  },
  { once: true }
);

next.addEventListener("click", () => {
  display_Ans();
});

start.addEventListener(
  "click",
  () => {
    start.style.display = "none";
    next.style.pointerEvents = "auto";
    display_Ans();
    let now = new Date();
    let timer = setInterval(() => {
      let date = (new Date() - now) / 1000;
      let min = Math.floor(date / 60);
      let sec = parseInt(date % 60);
      if (min >= 10 || i > amount) {
        clearInterval(timer);
        error.innerHTML = `Exam is over you give ${correct_answer} correct answer`;
        setTimeout(() => clear.click(), 5000);

        return;
      }
      let show = `${min.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;

      time.innerHTML = show;
    }, 1000);
  },
  { once: true }
);

async function getData() {
  const userdata = localStorage.getItem("userChoice");
  const { amount, category, difficulty } = JSON.parse(userdata);
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const quizData = await fetch(url);
  const data = await quizData.json();
  console.log(data);
  localStorage.setItem("apiData", JSON.stringify(data));
}
getData();
let i = 0;
let isAnswered = false;

function questionSelect() {
  console.log(i);
  const semidata = localStorage.getItem("apiData");
  if (semidata) {
    const data = JSON.parse(semidata);
    const que = data.results[i]?.question;
    const ans = data.results[i]?.incorrect_answers;
    const corrans = data.results[i]?.correct_answer;
    const sendData = { ques: que, answer: ans, correct: corrans };
    if (i == amount) {
      error.innerHTML = `Exam is over you give ${correct_answer} correct answer`;
      next.style.pointerEvents = "none";
      setTimeout(() => clear.click(), 3000);
      return;
    }

    i++;
    return sendData;
  }
}
let correct_answer = 0;
let wrong_answer = 0;

const userdata = localStorage.getItem("userChoice");
const { amount, category, difficulty } = JSON.parse(userdata);
function display_Ans() {
  isAnswered = false;
  const { ques, answer, correct } = questionSelect();

  let arr = [correct, ...answer].sort(() => Math.random() - 0.5);
  const options = document.getElementsByClassName("option");
  question.innerHTML = ques;

  for (let i = 0; i < options.length; i++) {
    options[i].innerHTML = arr[i];
    options[i].classList.remove("bg-success", "bg-danger");
    options[i].style.pointerEvents = "auto";
  }

  for (const op of options) {
    op.addEventListener(
      "click",
      () => {
        try {
          if (isAnswered) return;
          isAnswered = true;

          // Disable clicking on all options immediately
          for (const opt of options) {
            opt.style.pointerEvents = "none";
          }
          if (op.innerHTML == correct) {
            op.classList.add("bg-success");
            correct_answer++;
          } else {
            op.classList.add("bg-danger");
            wrong_answer++;
          }
        } catch (error) {
          console.log(error);
        } finally {
          range.value = (correct_answer / amount) * 100;
          range2.value = (wrong_answer / amount) * 100;

        }
      },
      { once: true }
    );
  }
}
display_Ans();
