const btn = document.querySelector("#done");

btn.addEventListener("click", () => {
  task.classList.toggle("line-through");
});
