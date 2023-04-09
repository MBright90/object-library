/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { initializeApp } from "firebase/app"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { signIn, signOutUser, initFirebaseAuth } from "./utilities/auth"
import firebaseConfig from "./firebase-config"
import APIManager from "./utilities/apiManager"
import sortingObject from "./utilities/sortingObject"
import { showStatsPage, updateStats } from "./utilities/utils"

import "./styles/style.css"

initializeApp(firebaseConfig)
initFirebaseAuth()

const bookApiEndpoint = "https://www.googleapis.com/books/v1/volumes?q="

const librarian = new APIManager(
  bookApiEndpoint,
  "AIzaSyCChOno95k5f75fCh9zynvxwo4qTf-5D4Q"
)

// ---------- Form completion and data retrieval ---------- //

const titleInput = document.querySelector("#book-title")
const authorInput = document.querySelector("#book-author")
const yearInput = document.querySelector("#book-year")
const descriptionInput = document.querySelector("#book-description")
const imageInput = document.querySelector("#book-cover-url")
const pagesInput = document.querySelector("#book-pages")

function parseFormData() {
  if (
    librarian.addBookToLibrary(
      titleInput.value,
      authorInput.value,
      yearInput.value,
      descriptionInput.value,
      imageInput.value,
      parseInt(pagesInput.value, 10)
    )
  ) {
    cancelBookForm()
  } else {
    alert(
      "Book could not be added, please check you are signed in and have completed all required fields"
    )
  }
}

const submitFormButton = document.querySelector("#add-book-button")
submitFormButton.addEventListener("click", parseFormData)

const autofillBtn = document.querySelector("form>button")
autofillBtn.addEventListener("click", () => {
  librarian.returnTitle(titleInput.value).then((response) => {
    titleInput.value = response.title
    authorInput.value = response.author
    yearInput.value = response.year
    pagesInput.value = response.pageCount
    descriptionInput.value = response.description
    imageInput.value = response.imageURL
  })
})

// ---------- Form/menu visibility functions ---------- //

const dropDownMenu = document.querySelector(".dropdown-container")

function showDropMenu() {
  if (dropDownMenu.dataset.menuVisible !== "true") {
    dropDownMenu.style.visibility = "visible"
    dropDownMenu.dataset.menuVisible = "true"
    dropDownButton.style = "border: 5px solid #FFFFFF; border-radius: 5px;"
  } else {
    removeDropMenu()
  }
}

function removeDropMenu() {
  if (dropDownMenu.dataset.menuVisible === "true") {
    dropDownMenu.style.visibility = "hidden"
    dropDownMenu.dataset.menuVisible = "false"
    dropDownButton.style.border = "none"
  }
}

let dropDownButton = document.querySelector(".menu-button")
dropDownButton.addEventListener("click", () => {
  showDropMenu()
  window.addEventListener("click", (e) => {
    if (e.composedPath()[2] !== document.querySelector(".menu-container")) {
      // Removes menu when clicking elsewhere on the page
      removeDropMenu()
    }
  })
})

const bookForm = document.querySelector(".book-form-background")
const aboutPage = document.querySelector(".about-page-background")

function showBookForm() {
  if (bookForm.style.visibility !== "visible") {
    bookForm.style.visibility = "visible"
  }
  removeDropMenu()
}

function cancelBookForm() {
  if (bookForm.style.visibility === "visible") {
    bookForm.style.visibility = "hidden"
  }
}

function showAboutPage() {
  if (aboutPage.style.visibility !== "visible") {
    aboutPage.style.visibility = "visible"
  }
  removeDropMenu()
}

function closeAboutPage() {
  if (aboutPage.style.visibility === "visible") {
    aboutPage.style.visibility = "hidden"
  }
}

const newFormButtons = document.querySelectorAll(".add-book-button")
newFormButtons.forEach((button) => {
  button.addEventListener("click", showBookForm)
})

const cancelFormButton = document.querySelector("button[type=reset]")
cancelFormButton.addEventListener("click", cancelBookForm)

const aboutPageButtons = document.querySelectorAll(".about-button")
aboutPageButtons.forEach((button) => {
  button.addEventListener("click", showAboutPage)
})

const closeAboutButton = document.querySelector(".close-about-button")
closeAboutButton.addEventListener("click", closeAboutPage)

// -------------- Book sorting functions ------------- //

const sortingHat = sortingObject()

const sortYearButtons = document.querySelectorAll(".sort-year-button")
sortYearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    removeDropMenu()
    removeAllCards()
    librarian.bookShelf?.sort(sortingHat.compareBooksYear).forEach((book) => {
      librarian.createNewCard(book)
    })
    sortingHat.toggleSortingOrder(sortYearButtons)
  })
})

const sortAZButtons = document.querySelectorAll(".sort-az-button")
sortAZButtons.forEach((button) => {
  button.addEventListener("click", () => {
    removeDropMenu()
    removeAllCards()
    librarian.bookShelf?.sort(sortingHat.compareBooksAZ).forEach((book) => {
      librarian.createNewCard(book)
    })
    sortingHat.toggleSortingOrder(sortAZButtons)
  })
})

// ---------------- Stat Showing functions -------------- //

const statsPage = document.querySelector(".stats-page-background")

const statsButtons = document.querySelectorAll(".stats-button")
statsButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await updateStats(librarian.getCurrentStats())
    showStatsPage(statsPage)
  })
})

const closeStatsButton = document.querySelector(".close-stats-button")
closeStatsButton.addEventListener("click", () => {
  statsPage.style.visibility = "hidden"
})

// ---------------- Card removal functions -------------- //

function removeAllCards() {
  const cardDeck = document.querySelectorAll(".card")
  cardDeck?.forEach((card) => {
    card.remove()
  })
}

function resetLibrary() {
  if (window.confirm("Are you sure you want to clear all book data?")) {
    librarian.clearFirestore(librarian.bookShelf)
    showAllBooks()
  }
}

const resetLibraryButtons = document.querySelectorAll(".reset-button")
resetLibraryButtons.forEach((button) => {
  button.addEventListener("click", resetLibrary)
})

// -------------- Library invocation ------------ //

async function updateBookShelf() {
  await librarian.getUsersBooks().then((result) => {
    librarian.bookShelf = result
  })
}

async function showAllBooks() {
  await updateBookShelf()
  removeAllCards()
  librarian.bookShelf.forEach((book) => librarian.createNewCard(book))
}

async function initLibrary() {
  onAuthStateChanged(getAuth(), showAllBooks)
}

initLibrary()

// --------- Firebase Auth Integration --------- //

const signInButton = document.querySelector(".sign-in")
signInButton.addEventListener("click", signIn)

const signInMain = document.querySelector(".sign-in-main")
signInMain.addEventListener("click", signIn)

const signOutButton = document.querySelector(".sign-out-button")
signOutButton.addEventListener("click", signOutUser)
