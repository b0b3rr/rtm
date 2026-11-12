var box3 = document.getElementById("box3");
var box2 = document.getElementById("box2");
var box1 = document.getElementById("box1");
var wordInput = document.getElementById("wordInput");
var parseBtn = document.getElementById("parseBtn");
var clearBtn = document.getElementById("clearBtn");
var errorMsg = document.getElementById("errorMsg");
var output = document.getElementById("output");

var currentWords = [];
var baseColor = randomColor();
var draggedElement = null;
var draggedKey = null;
var draggedWord = null;
var draggedFrom = null;
var draggedOldLeft = 0;
var draggedOldTop = 0;
var dropDone = false;

function randomColor() {
  var h = Math.floor(Math.random() * 360);
  return "hsl(" + h + ", 85%, 70%)";
}

function parseString(str) {
  var parts = str.split(/[-—]/);
  var tokens = [];
  var i;

  for (i = 0; i < parts.length; i++) {
    var t = parts[i].trim();
    if (t !== "") {
      tokens.push(t);
    }
  }

  if (tokens.length === 0) {
    return { error: "Введите слова через тире" };
  }
  if (tokens.length > 20) {
    return { error: "Слишком много слов (максимум 20)" };
  }

  var lower = [];
  var upper = [];
  var numbers = [];

  for (i = 0; i < tokens.length; i++) {
    var t = tokens[i];

    if (/^[0-9]+$/.test(t)) {
      numbers.push(parseInt(t, 10));
    } else if (/^[а-яё]+$/.test(t)) {
      lower.push(t);
    } else if (/^[А-ЯЁ][а-яё]*$/.test(t)) {
      upper.push(t);
    } else {
      return { error: "Ошибка: «" + t + "». Только русские слова и цифры" };
    }
  }

  lower.sort();
  upper.sort();
  numbers.sort(function (a, b) { return a - b; });

  var result = [];
  var n = 1;
  for (i = 0; i < lower.length; i++) {
    result.push({ key: "a" + n, word: lower[i] });
    n++;
  }
  n = 1;
  for (i = 0; i < upper.length; i++) {
    result.push({ key: "b" + n, word: upper[i] });
    n++;
  }
  n = 1;
  for (i = 0; i < numbers.length; i++) {
    result.push({ key: "n" + n, word: String(numbers[i]) });
    n++;
  }

  return { words: result };
}

function renderBox3() {
  box3.innerHTML = "";
  var i;
  for (i = 0; i < currentWords.length; i++) {
    var w = currentWords[i];
    var el = document.createElement("span");
    el.className = "oval";
    el.textContent = w.word;
    el.style.background = baseColor;
    el.draggable = true;
    el.dataset.key = w.key;
    el.dataset.word = w.word;
    el.dataset.from = "box3";
    el.addEventListener("dragstart", onDragStart);
    box3.appendChild(el);
  }
}

function onDragStart(e) {
  draggedElement = e.target;
  draggedKey = e.target.dataset.key;
  draggedWord = e.target.dataset.word;
  draggedFrom = e.target.dataset.from;
  dropDone = false;

  if (draggedFrom === "box2") {
    draggedOldLeft = parseInt(draggedElement.style.left, 10) || 0;
    draggedOldTop = parseInt(draggedElement.style.top, 10) || 0;
  }

  e.dataTransfer.setData("text/plain", draggedKey);
  e.dataTransfer.effectAllowed = "move";

  draggedElement.addEventListener("dragend", onDragEnd);

  setTimeout(function () {
    if (draggedElement) {
      draggedElement.style.visibility = "hidden";
    }
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dragEnter(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.preventDefault();

  if (!draggedElement) {
    return;
  }

  dropDone = true;

  var target = e.currentTarget;
  var rect = target.getBoundingClientRect();

  var centerX = e.clientX;
  var centerY = e.clientY;

  var inside =
    centerX >= rect.left &&
    centerX <= rect.right &&
    centerY >= rect.top &&
    centerY <= rect.bottom;

  if (!inside) {
    dropDone = false;
    return;
  }

  if (target === box2) {
    dropToBox2(e, rect);
  } else if (target === box3) {
    dropToBox3(e, rect);
  }
}

function onDragEnd(e) {
  if (!draggedElement) {
    return;
  }

  draggedElement.removeEventListener("dragend", onDragEnd);

  if (!dropDone) {
    // drop не состоялся — возвращаем на место
    if (draggedFrom === "box3") {
      draggedElement.style.visibility = "visible";
    } else {
      draggedElement.style.visibility = "visible";
      draggedElement.style.left = draggedOldLeft + "px";
      draggedElement.style.top = draggedOldTop + "px";
    }
  }

  resetDrag();
}

function resetDrag() {
  if (draggedElement) {
    draggedElement.style.visibility = "visible";
  }
  draggedElement = null;
  draggedKey = null;
  draggedWord = null;
  draggedFrom = null;
}

function dropToBox2(e, boxRect) {
  var el = draggedElement;

  if (draggedFrom === "box3") {
    var newArr = [];
    var i;
    for (i = 0; i < currentWords.length; i++) {
      if (currentWords[i].key !== draggedKey) {
        newArr.push(currentWords[i]);
      }
    }
    currentWords = newArr;
    renderBox3();
    el = document.createElement("span");
    el.className = "oval";
    el.textContent = draggedWord;
    el.draggable = true;
    el.dataset.key = draggedKey;
    el.dataset.word = draggedWord;
    el.addEventListener("dragstart", onDragStart);
    box2.appendChild(el);
  } else {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    box2.appendChild(el);
  }

  el.dataset.from = "box2";
  el.style.visibility = "visible";
  el.style.background = randomColor();

  var newRect = el.getBoundingClientRect();
  var x = e.clientX - boxRect.left - newRect.width / 2;
  var y = e.clientY - boxRect.top - newRect.height / 2;

  var maxX = boxRect.width - newRect.width;
  var maxY = boxRect.height - newRect.height;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  el.style.left = x + "px";
  el.style.top = y + "px";
}

function dropToBox3(e, boxRect) {
  var el = draggedElement;

  if (draggedFrom === "box3") {
    return;
  }

  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }

  var word = el.dataset.word;
  var key = el.dataset.key;
  var inserted = false;
  var newArr = [];
  var i;

  for (i = 0; i < currentWords.length; i++) {
    if (!inserted && currentWords[i].key > key) {
      newArr.push({ key: key, word: word });
      inserted = true;
    }
    newArr.push(currentWords[i]);
  }
  if (!inserted) {
    newArr.push({ key: key, word: word });
  }
  currentWords = newArr;

  renderBox3();
}


function onOvalClickInBox2(e) {
  var el = e.target;
  var word = el.dataset.word;
  var color = el.style.background;

  var line = document.createElement("span");
  line.className = "word-item";
  line.textContent = word;
  line.style.color = color;
  output.appendChild(line);
}

function parseHandler() {
  errorMsg.textContent = "";

  var result = parseString(wordInput.value);

  if (result.error) {
    errorMsg.textContent = result.error;
    return;
  }

  var ovals = box2.querySelectorAll(".oval");
  var i;
  for (i = 0; i < ovals.length; i++) {
    ovals[i].parentNode.removeChild(ovals[i]);
  }

  output.innerHTML = "";
  currentWords = result.words;
  baseColor = randomColor();
  renderBox3();
}

function clearHandler() {
  currentWords = [];
  baseColor = randomColor();
  box3.innerHTML = "";
  box1.innerHTML = "";
  box2.innerHTML = "";
  wordInput.value = "";
  errorMsg.textContent = "";

  box1.innerHTML =
    '<div class="box1-top">' +
      '<input type="text" id="wordInput" placeholder="слова - числа - 123">' +
      '<button type="button" id="parseBtn">Разобрать</button>' +
    '</div>' +
    '<p id="errorMsg" class="error-msg"></p>' +
    '<div id="output"></div>';

  wordInput = document.getElementById("wordInput");
  parseBtn = document.getElementById("parseBtn");
  errorMsg = document.getElementById("errorMsg");
  output = document.getElementById("output");

  parseBtn.addEventListener("click", parseHandler);
}

parseBtn.addEventListener("click", parseHandler);
clearBtn.addEventListener("click", clearHandler);

box2.addEventListener("click", function (e) {
  if (e.target.classList.contains("oval")) {
    onOvalClickInBox2(e);
  }
});

box2.addEventListener("dragstart", onDragStart);