document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.toggle-btn');
  const panel = document.querySelector('.budget-panel');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('open');
      toggleBtn.classList.toggle('spin');
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const incomeForm = document.querySelector(".income-form");

  if (incomeForm) {
    incomeForm.addEventListener("submit", () => {
      const btn = incomeForm.querySelector("button");
      btn.classList.add("saved");

      setTimeout(() => {
        btn.classList.remove("saved");
      }, 600);
    });
  }
});
