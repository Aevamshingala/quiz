// --------------------variable-------------------->>>>

const question = document.getElementById("que");
const clear = document.querySelector(".clear");
const next = document.querySelector(".next");
const error = document.getElementById("error");
let range = document.getElementById("range");
let range2 = document.getElementById("range2");
const start = document.querySelector(".start");
const time = document.getElementById("time");
// <<<<------------------------------------------------

// ----------------style--------------------------->>>>
next.style.pointerEvents = "none";
start.style.opacity = 0.8;

// <<<<------------------------------------------------
// ----------------Local Storage---------------------- >>>>

if (!localStorage.getItem("refresh")) {
  localStorage.setItem("refresh", "false");
}

const userdata = localStorage.getItem("userChoice");
const { amount, category, difficulty } = JSON.parse(userdata);

if (!localStorage.getItem("keepVal")) {
  localStorage.setItem(
    "keepVal",
    JSON.stringify({ i: 0, correct_answer: 0, wrong_answer: 0 })
  );
}

const localch = localStorage.getItem("keepVal");
let { i, correct_answer, wrong_answer } = JSON.parse(localch);
let isAnswered = false;

// <<<<-----------------------------------------------------

// -----------------event listener----------------------->>>>
clear.addEventListener(
  "click",
  () => {
    // localStorage.removeItem("apiData");
    // localStorage.removeItem("refresh");
    // localStorage.removeItem("keepVal");

    localStorage.clear();
    window.location.href = "index.html";
  },
  { once: true }
);

next.addEventListener("click", () => {
  display_Ans();
});

start.addEventListener("mouseover", call, { once: true });
// <<<<--------------------------------------------------------

// ---------------------functions----------------------------->>>>
function call() {
  start.style.opacity = 1;
  if (localStorage.getItem("refresh") === "false") {
    // if the localstorage has false meance i imported data one time so when i refresh the page it don't import data second time
    getData().then(() => {
      startt();
    });
    localStorage.setItem("refresh", "true");
  } else {
    startt();
  }

  start.removeEventListener("mouseover", call);
  // it remove the eventlistener so it don't make troble
}

function startt() {
  start.addEventListener(
    "click",
    () => {
      display_Ans();
      // ----------- give the style ---------->>>>>
      start.style.display = "none";
      next.style.pointerEvents = "auto";
      // <<<<---------------------------------------

      // --------------DATE--------------------->>>>
      // take the current date and then in setinterval it take Date every second and make a timer after time over exam will be over

      if (!localStorage.getItem("time")) {
        localStorage.setItem("time", JSON.stringify(new Date()));
      }
      let now = new Date(JSON.parse(localStorage.getItem("time")));
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
        // padstart is use when i need more then 1 value so i give 2 if more then 1 value not exist then it add '0' at first
        let show = `${min.toString().padStart(2, "0")}:${sec
          .toString()
          .padStart(2, "0")}`;

        time.innerHTML = show;
      }, 1000);

      start.remove();
      // it removes the button start form html
    },
    { once: true }
  );
}
async function getData() {
  const userdata = localStorage.getItem("userChoice");
  const { amount, category, difficulty } = JSON.parse(userdata);
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const quizData = await fetch(url);
  const data = await quizData.json();

  localStorage.setItem("apiData", JSON.stringify(data));
}

function questionSelect() {
  const semidata = localStorage.getItem("apiData");
  if (semidata) {
    const data = JSON.parse(semidata);
    const que = data.results[i]?.question;
    const ans = data.results[i]?.incorrect_answers;
    const corrans = data.results[i]?.correct_answer;
    const sendData = { ques: que, answer: ans, correct: corrans };
    if (i == amount - 1) {
      next.innerHTML = "last";
    }
    if (i == amount) {
      next.innerHTML = "over";
      error.innerHTML = `Exam is over you give ${correct_answer} correct answer`;
      next.style.pointerEvents = "none";
      setTimeout(() => clear.click(), 3000);
      return;
    }

    localStorage.setItem(
      "keepVal",
      JSON.stringify({
        i: i,
        correct_answer: correct_answer,
        wrong_answer: wrong_answer,
      })
    );
    i++;
    return sendData;
  }
}

function display_Ans() {
  isAnswered = false; // Reset the flag for each new question
  const { ques, answer, correct } = questionSelect();

  let arr = [correct, ...answer].sort(() => Math.random() - 0.5);
  const options = document.getElementsByClassName("option");
  question.innerHTML = ques;

  for (let i = 0; i < options.length; i++) {
    options[i].innerHTML = arr[i];
    options[i].classList.remove("bg-success", "bg-danger");
    options[i].style.pointerEvents = "auto";

    // Remove previous event listeners to prevent multiple bindings
    options[i].replaceWith(options[i].cloneNode(true));
  }
  const parse = new DOMParser();
  const fi_co = parse.parseFromString(correct, "text/html").body.textContent;

  // Attach new event listeners with fresh correct value
  for (let i = 0; i < options.length; i++) {
    try {
      const deco_fi = parse.parseFromString(options[i].innerHTML, "text/html")
        .body.textContent;
      let selectedOption = options[i]; // Capture a fresh reference
      selectedOption.addEventListener("click", function () {
        if (isAnswered) return; // Prevent multiple event firings
        isAnswered = true;
        for (const e of options) {
          const deco = parse.parseFromString(e.innerHTML, "text/html").body
            .textContent;
          if (deco === fi_co) {
            e.classList.add("bg-success");
          }
        }
        if (deco_fi === fi_co) {
          selectedOption.classList.add("bg-success");
          correct_answer++;
        } else {
          selectedOption.classList.add("bg-danger");
          wrong_answer++;
        }
        selectedOption.style.pointerEvents = "none";
      });
    } catch (e) {
    } finally {
      range.value = (correct_answer / amount) * 100;
      range2.value = (wrong_answer / amount) * 100;
    }
  }
}
// <<<<----------------------------------------------------------------
