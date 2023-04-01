/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import APIManager from "./utilities/apiManager"
import sortingObject from "./utilities/sortingObject"

import "./style.css"

const bookApiEndpoint = "https://www.googleapis.com/books/v1/volumes?q="

const librarian = new APIManager(
  bookApiEndpoint,
  "AIzaSyCChOno95k5f75fCh9zynvxwo4qTf-5D4Q"
)

// ---------- Retrieving local storage // Creating initial example book objects ---------- //

if (window.localStorage.getItem("userLibrary")) {
  const libraryString = window.localStorage.getItem("userLibrary")
  librarian.bookShelf = JSON.parse(libraryString)
} else {
  librarian.returnTitle("the Da Vinci Code").then((response) => {
    librarian.addBookToLibrary(
      response.title,
      response.author,
      response.year,
      response.description,
      response.imageURL,
      response.pageCount
    )
  })

  librarian.returnTitle("The Great Gatsby").then((response) => {
    librarian.addBookToLibrary(
      response.title,
      response.author,
      response.year,
      response.description,
      response.imageURL,
      response.pageCount
    )
  })

  librarian.returnTitle("The Fellowship of the Ring").then((response) => {
    librarian.addBookToLibrary(
      response.title,
      response.author,
      response.year,
      response.description,
      response.imageURL,
      response.pageCount
    )
  })

  librarian.returnTitle("The Goblet of Fire").then((response) => {
    librarian.addBookToLibrary(
      response.title,
      response.author,
      response.year,
      response.description,
      response.imageURL,
      response.pageCount
    )
  })

  librarian.returnTitle("Bridget Jones").then((response) => {
    librarian.addBookToLibrary(
      response.title,
      response.author,
      response.year,
      response.description,
      response.imageURL,
      response.pageCount
    )

    librarian.bookShelf.forEach((book) => {
      librarian.createNewCard(book)
    })
  })
}

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
    librarian.createNewCard(librarian.bookShelf[librarian.bookShelf.length - 1])
    cancelBookForm()
  } else {
    alert("Please complete all required form fields")
  }
}

const submitFormButton = document.querySelector(
  ".form-buttons-container>button[type=button]"
)
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

const toggleSortingOrder = (nodeList) => {
  nodeList.forEach((button) => {
    if (button.dataset.sortingOrder === "ascending") {
      button.dataset.sortingOrder = "descending"
      if (button.textContent === "Sort by A-Z") {
        button.textContent = "Sort by Z-A"
      } else {
        button.textContent = "Sort by Newest"
      }
    } else {
      button.dataset.sortingOrder = "ascending"
      if (button.textContent === "Sort by Z-A") {
        button.textContent = "Sort by A-Z"
      } else {
        button.textContent = "Sort by Oldest"
      }
    }
  })
}

const sortYearButtons = document.querySelectorAll(".sort-year-button")
sortYearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    removeDropMenu()
    removeAllCards()
    librarian.bookShelf.sort(sortingHat.compareBooksYear).forEach((book) => {
      librarian.createNewCard(book)
    })
    toggleSortingOrder(sortYearButtons)
  })
})

const sortAZButtons = document.querySelectorAll(".sort-az-button")
sortAZButtons.forEach((button) => {
  button.addEventListener("click", () => {
    removeDropMenu()
    removeAllCards()
    librarian.bookShelf.sort(sortingHat.compareBooksAZ).forEach((book) => {
      librarian.createNewCard(book)
    })
    toggleSortingOrder(sortAZButtons)
  })
})

// ---------------- Stat creation functions -------------- //

const totalBooksPara = document.querySelector(".total-books")
const booksReadPara = document.querySelector(".books-read")
const totalPagesPara = document.querySelector(".total-pages")
const pagesReadPara = document.querySelector(".pages-read")

function updateStats() {
  totalBooksPara.textContent = librarian.bookShelf.length
  booksReadPara.textContent = librarian.countBooksRead()
  totalPagesPara.textContent = librarian.countTotalPages()
  pagesReadPara.textContent = librarian.countPagesRead()
}

const statsPage = document.querySelector(".stats-page-background")

function showStatsPage() {
  if (statsPage.style.visibility !== "visible") {
    statsPage.style.visibility = "visible"
  }
}

const statsButtons = document.querySelectorAll(".stats-button")
statsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateStats()
    showStatsPage()
  })
})

const closeStatsButton = document.querySelector(".close-stats-button")
closeStatsButton.addEventListener("click", () => {
  statsPage.style.visibility = "hidden"
})

// ---------------- Card removal functions -------------- //

function removeAllCards() {
  const cardDeck = document.querySelectorAll(".card")
  cardDeck.forEach((card) => {
    card.remove()
  })
}

function resetLibrary() {
  if (window.localStorage.getItem("userLibrary")) {
    removeDropMenu()
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Delete Library?")) {
      window.localStorage.removeItem("userLibrary")
      librarian.bookShelf = []
      removeAllCards()
    }
  }
}

const resetLibraryButtons = document.querySelectorAll(".reset-button")
resetLibraryButtons.forEach((button) => {
  button.addEventListener("click", resetLibrary)
})

// -------------- Library invocation ------------ //

librarian.bookShelf.forEach((book) => {
  librarian.createNewCard(book)
})
