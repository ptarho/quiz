const answerVariant = document.querySelectorAll(".quiz__radio");
const answerLabel = document.querySelectorAll(".quiz__label");
const nextBtn = document.querySelector(".quiz__button");
const quizQuestion = document.querySelector(".quiz__question");
const questionText = document.querySelector(".question__text");
// const questionImage = document.querySelector(".question__image");
const quizForm = document.querySelector(".quiz__form");
const progressBar = document.querySelector(".quiz__progress");

//console.log(answerVariant);
//const questions = await getQuestions()

async function getQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
}

function displayVariants(arr, style) {
  quizForm.innerHTML = "";
  if (style === "column") {
    quizForm.classList = "quiz__form-column";
  } else if (style === "row") {
    quizForm.classList = "quiz__form-row";
  } else if (style === "grid") {
    quizForm.classList = "quiz__form-grid";
  }

  arr.forEach((e) => {
    const variant = document.createElement("label");
    if (style === "grid") {
      variant.classList.add(`label__${style}`);
      variant.style.backgroundColor = e;
      variant.value = e
    } else if (style === "row") {
      variant.classList.add(`label__${style}`);
    } else {
      variant.classList.add("label");
      //variant.classList.add(`label__${style}`);
    }

    const span = document.createElement("span");
    span.classList.add("quiz__span");
    span.innerText = style !== "grid" ? e : null;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.value = e;
    radio.name = "answer";
    radio.classList.add("quiz__radio");
    if (style !== "column") {
      radio.style.display = "none";
    }
    radio.onclick = () => {
      handleAnswerSelection(radio);
    };

    variant.appendChild(span);
    variant.appendChild(radio);
    quizForm.appendChild(variant);
    //console.log(variant);
  });
}

function updateProgressBar(num, totalNum) {
  progressBar.style.width = `${(num / totalNum) * 100}%`;
}

let activeVariant = null;
function handleAnswerSelection(element) {
  let className = element.parentElement.classList[0];
  console.log(element.parentElement.classList[0]);
  if (activeVariant) {
    activeVariant.classList.toggle(`${className}-active`);
  } else {
    nextBtn.classList.add(`quiz__button-active`);
  }
  activeVariant = element.parentElement;
  activeVariant.classList.toggle(`${className}-active`);
}

function displayQuestion(node) {
  quizQuestion.innerHTML = "";
  questionText.innerText = node.question;
  quizQuestion.appendChild(questionText);

  if (node.img) {
    const questionImg = document.createElement("img");
    questionImg.setAttribute("src", `/images/${node.img}`);
    questionImg.classList.add("quiz__image");
    quizQuestion.appendChild(questionImg);
  }

  displayVariants(node.variants, node.style);
}

function displayLoadingPage() {
  quizForm.innerHTML = "";
  quizQuestion.innerHTML = "";
  
  questionText.innerText = "Обработка результатов";
  quizQuestion.appendChild(questionText);

  const loader = document.createElement("span")
  loader.classList.add("loader")
  quizQuestion.appendChild(loader)

  const text = document.createElement("p")
  text.innerText = "Обработка стиля мышления....."
  quizQuestion.appendChild(text)
}

window.addEventListener("load", async () => {
  const questions = await getQuestions(); //get questions list
  let questionNumber = 0; //set counter to the first question
  const answers = []
  displayQuestion(questions[questionNumber]);

  nextBtn.onclick = () => {
    if (!activeVariant) {
      return alert("Chose a variant");
    }
    let answer = {
      question: questions[questionNumber].question,
      answer: activeVariant.innerText ? activeVariant.innerText : activeVariant.value
    }
    answers.push(answer)
    console.log(answers)
    questionNumber++;
    if (questionNumber === questions.length) {
      console.log(answers)
      updateProgressBar(questionNumber, questions.length);
      displayLoadingPage()

      return setTimeout(() => {
        console.log("redirect");
        location.href = "/pages/results/results.html";
      }, 5000);
    }

    
    nextBtn.classList.remove("quiz__button-active");
    activeVariant = null;

    displayQuestion(questions[questionNumber]);
    updateProgressBar(questionNumber, questions.length);
  };
});
