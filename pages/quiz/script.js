//get DOM elements
const nextBtn = document.querySelector(".quiz__button");
const quizQuestion = document.querySelector(".quiz__question");
const questionText = document.querySelector(".question__text");
const quizForm = document.querySelector(".quiz__form");
const progressBar = document.querySelector(".quiz__progress");

//get question list from JSON file
async function getQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
}


//display all answers for a single question
function displayVariants(arr, style) {
  //clear form from old data
  quizForm.innerHTML = "";
  //add class based on question style property
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
      variant.value = e;
    } else if (style === "row") {
      variant.classList.add(`label__${style}`);
    } else {
      variant.classList.add("label");
    }

    const span = document.createElement("span");
    span.classList.add("quiz__span");
    span.innerText = style !== "grid" ? e : null;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.value = e;
    radio.name = "answer";
    radio.classList.add("quiz__radio");
    radio.onclick = () => {
      handleAnswerSelection(radio);
    };

    const customRadio = document.createElement("span");
    customRadio.classList.add("quiz__custom-radio");
    if (style !== "column") {
      customRadio.style.display = "none";
    }

    variant.appendChild(span);
    variant.appendChild(radio);
    variant.appendChild(customRadio);

    quizForm.appendChild(variant);
  });
}

function updateProgressBar(num, totalNum) {
  progressBar.style.width = `${(num / totalNum) * 100}%`;
}

let activeVariant = null;
function handleAnswerSelection(element) {
  //get label class name
  let className = element.parentElement.classList[0];

  if (activeVariant) {
    activeVariant.classList.toggle(`${className}-active`);
  } else {
    nextBtn.classList.add(`quiz__button-active`);
  }

  activeVariant = element.parentElement;
  activeVariant.classList.toggle(`${className}-active`);
}

//display question text and image (if it has one)
function displayQuestion(node) {
  quizQuestion.innerHTML = "";
  questionText.innerText = node.question;
  quizQuestion.appendChild(questionText);

  if (node.img) {
    const questionImg = document.createElement("img");
    questionImg.setAttribute("src", `../../images/${node.img}`);
    questionImg.classList.add("quiz__image");
    quizQuestion.appendChild(questionImg);
  }
  if (node.hr) {
    const hr = document.createElement("hr");
    hr.classList.add("quiz__hr");
    quizQuestion.appendChild(hr);
  }
}

function displayLoadingPage(answers) {
  console.log(answers); // placeholder for answers analysis

  quizForm.innerHTML = "";
  quizQuestion.innerHTML = "";

  questionText.innerText = "Обработка результатов";
  quizQuestion.appendChild(questionText);

  const loader = document.createElement("span");
  loader.classList.add("loader");
  quizQuestion.appendChild(loader);

  const text = document.createElement("p");
  text.innerText = "Обработка стиля мышления.....";
  quizQuestion.appendChild(text);
}

window.addEventListener("load", async () => {
  const questions = await getQuestions(); //get questions list
  let questionNumber = 0; //set counter to the first question
  const answers = [];
  displayQuestion(questions[questionNumber]);

  nextBtn.onclick = () => {
    if (!activeVariant) {
      return alert("Chose a variant");
    }
    let answer = {
      question: questions[questionNumber].question,
      answer: activeVariant.innerText
        ? activeVariant.innerText
        : activeVariant.value, //handle color question
    };
    answers.push(answer); //save answer

    questionNumber++;
    //check if that was the last question
    if (questionNumber === questions.length) {
      updateProgressBar(questionNumber, questions.length);
      displayLoadingPage(answers);

      return setTimeout(() => {
        console.log("redirect");
        location.href = "/quiz/pages/results/results.html";
      }, 5000);
    }

    nextBtn.classList.remove("quiz__button-active"); //reset button style
    activeVariant = null; //reset selected answer

    displayQuestion(questions[questionNumber]); //display next question
    displayVariants(questions[questionNumber].variants, questions[questionNumber].style); //display nex question variants
    updateProgressBar(questionNumber, questions.length); 
  };
});
