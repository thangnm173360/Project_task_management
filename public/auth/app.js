const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");

sign_up_btn.addEventListener("click", () => {
  window.location.href = 'http://127.0.0.1:8000/register';
});

sign_in_btn.addEventListener("click", () => {
  window.location.href = 'http://127.0.0.1:8000/login';
});
