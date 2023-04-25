const headerBtn = document.querySelector(".header__btn")
const navCloseBtn = document.querySelector(".navigation__button")
const navMenu = document.querySelector(".navigation")
//const navInfoBtn = document.querySelector("")

headerBtn.addEventListener("click", () => navMenu.style.display = "block")
navCloseBtn.addEventListener("click", () => navMenu.style.display = "none")