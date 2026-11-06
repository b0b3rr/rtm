document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var contact = document.getElementById("contact").value.trim();
  var message = document.getElementById("formMessage");

  if (contact === "") {
    message.textContent = "Введите телефон или Telegram.";
    return;
  }

  message.textContent = "Заявка отправлена! Мы свяжемся с вами.";
  document.getElementById("orderForm").reset();
});

var faqButtons = document.querySelectorAll(".faq-question");
for (var i = 0; i < faqButtons.length; i++) {
  faqButtons[i].addEventListener("click", function () {
    var item = this.parentNode;
    if (item.classList.contains("open")) {
      item.classList.remove("open");
    } else {
      item.classList.add("open");
    }
  });
}