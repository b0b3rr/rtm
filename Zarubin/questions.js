const questions = [
  {
    text: "Если человека назвали мордофиля, то это…",
    answers: [
      {
        text: "Значит, что он тщеславный.",
        correct: true,
        explain: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный."
      },
      { text: "Значит, что у него лицо как у хряка.", correct: false },
      { text: "Значит, что чумазый.", correct: false }
    ]
  },
  {
    text: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
    answers: [
      {
        text: "Он маленький и невзрачный.",
        correct: true,
        explain: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи."
      },
      { text: "Он тот еще алкоголик.", correct: false },
      { text: "Он не держит свое слово.", correct: false }
    ]
  },
  {
    text: "Если человека прозвали пятигузом, значит, он…",
    answers: [
      {
        text: "Не держит слово.",
        correct: true,
        explain: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек."
      },
      { text: "Изменяет жене", correct: false },
      { text: "Без гроша в кармане.", correct: false }
    ]
  },
  {
    text: "Кто такой шлындра?",
    answers: [
      { text: "Обманщик.", correct: false },
      { text: "Нытик.", correct: false },
      {
        text: "Бродяга.",
        correct: true,
        explain: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться."
      }
    ]
  },
  {
    text: "В каком случае про человека можно сказать, что он охренел (в смысле «обнаглел/перешёл границы»), а не просто удивился?",
    answers: [
      {
        text: "Он без спроса берёт твои вещи и делает вид, что так и надо.",
        correct: true,
        explain: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
      },
      {
        text: "Он в наглую лезет без очереди и ещё возмущается, что его не пропускают.",
        correct: true,
        explain: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
      },
      { text: "Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»", correct: false },
      { text: "В осеннем лесу наблюдается завихрение листьев.", correct: false }
    ]
  }
];

const quiz = document.getElementById("quiz");
const finish = document.getElementById("finish");
const stats = document.getElementById("stats");
const restart = document.getElementById("restart");

let mixed = mix(questions);
let currentIndex = 0;
let correctCount = 0;
let locked = false;

function mix(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function showQuestion() {
  if (currentIndex >= mixed.length) {
    finishQuiz();
    return;
  }

  const data = mixed[currentIndex];

  const row = document.createElement("div");
  row.className = "q-row";

  const qBlock = document.createElement("div");
  qBlock.className = "q-block";

  const num = document.createElement("span");
  num.className = "num";
  num.textContent = currentIndex + 1;

  const qText = document.createElement("span");
  qText.className = "qtext";
  qText.textContent = data.text;

  const marker = document.createElement("span");
  marker.className = "marker";

  qBlock.appendChild(num);
  qBlock.appendChild(qText);
  qBlock.appendChild(marker);

  const answersRow = document.createElement("div");
  answersRow.className = "a-row";

  const mixedAnswers = mix(data.answers);

  for (let i = 0; i < mixedAnswers.length; i++) {
    const answerData = mixedAnswers[i];

    const a = document.createElement("div");
    a.className = "a-block";

    const aText = document.createElement("span");
    aText.textContent = answerData.text;
    a.appendChild(aText);

    if (answerData.explain) {
      const explain = document.createElement("div");
      explain.className = "explain";
      explain.textContent = answerData.explain;
      a.appendChild(explain);
    }

    a.dataset.correct = answerData.correct ? "1" : "0";

    a.addEventListener("click", function () {
      handleAnswer(a, answerData, qBlock, answersRow);
    });

    answersRow.appendChild(a);
  }

  row.appendChild(qBlock);
  row.appendChild(answersRow);
  quiz.appendChild(row);

  locked = false;
}

function handleAnswer(answerEl, answerData, qBlock, answersRow) {
  if (locked) {
    return;
  }
  locked = true;

  answerEl.classList.add("shake");
  setTimeout(function () {
    answerEl.classList.remove("shake");
  }, 420);

  const allAnswers = answersRow.children;

  for (let i = 0; i < allAnswers.length; i++) {
    allAnswers[i].classList.add("disabled");
  }

  const marker = qBlock.querySelector(".marker");

  if (answerData.correct) {
    marker.textContent = "✔";
    marker.style.color = "#3ddc84";
    qBlock.classList.add("correct");
    correctCount = correctCount + 1;
  } else {
    marker.textContent = "✖";
    marker.style.color = "#ff5c7a";
    qBlock.classList.add("wrong");
  }
  marker.classList.add("show");

  if (answerData.correct) {
    for (let i = 0; i < allAnswers.length; i++) {
      if (allAnswers[i].dataset.correct === "1") {
        allAnswers[i].classList.add("correct");
      }
    }
  }

  for (let i = 0; i < allAnswers.length; i++) {
    const el = allAnswers[i];
    const delay = 2000 + i * 300;
    setTimeout(function () {
      el.classList.add("leaving");
    }, delay);
  }

  const totalDelay = 2000 + allAnswers.length * 300 + 500;

  setTimeout(function () {
    answersRow.innerHTML = "";
    currentIndex = currentIndex + 1;

    if (currentIndex >= mixed.length) {
      finishQuiz();
    } else {
      showQuestion();
    }
  }, totalDelay);
}

function finishQuiz() {
  finish.classList.add("show");

  stats.innerHTML = "Правильных ответов: <b>" + correctCount + "</b> из <b>" + mixed.length + "</b>";
  stats.classList.add("show");

  restart.classList.add("show");

  const qBlocks = document.querySelectorAll(".q-block");

  for (let i = 0; i < qBlocks.length; i++) {
    const qBlock = qBlocks[i];
    const index = i;

    qBlock.style.cursor = "pointer";
    qBlock.addEventListener("click", function () {
      revealCorrect(qBlock, index);
    });
  }
}


function restartQuiz() {
  quiz.innerHTML = "";
  finish.classList.remove("show");
  stats.classList.remove("show");
  restart.classList.remove("show");

  mixed = mix(questions);
  currentIndex = 0;
  correctCount = 0;
  locked = false;

  showQuestion();
}

function revealCorrect(qBlock, index) {
  const allRows = document.querySelectorAll(".q-row");

  for (let i = 0; i < allRows.length; i++) {
    const oldAnswers = allRows[i].querySelector(".a-row");
    if (oldAnswers) {
      oldAnswers.innerHTML = "";
    }
  }

  const data = mixed[index];

  const row = qBlock.parentNode;
  const answersRow = row.querySelector(".a-row");

  for (let i = 0; i < data.answers.length; i++) {
    const answerData = data.answers[i];

    if (!answerData.correct) {
      continue;
    }

    const box = document.createElement("div");
    box.className = "a-block correct";

    const boxText = document.createElement("span");
    boxText.textContent = answerData.text;
    box.appendChild(boxText);

    if (answerData.explain) {
      const explain = document.createElement("div");
      explain.className = "explain";
      explain.textContent = answerData.explain;
      box.appendChild(explain);
    }

    answersRow.appendChild(box);
  }
}

showQuestion();

console.log(questions);

restart.addEventListener("click", restartQuiz);