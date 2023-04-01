import Book from "./book"

export default class APIManager {
  constructor(endpoint, key) {
    this.endpoint = endpoint
    this.key = key
    this.bookShelf = []
  }

  saveCurrentLibrary() {
    const currentLibrary = JSON.stringify(this.bookShelf)
    window.localStorage.setItem("userLibrary", currentLibrary) // Saving library state in local storage
  }

  addBookToLibrary(title, author, year, description, imageURL, pageCount) {
    this.bookShelf.push(
      new Book(
        title,
        author,
        year || null,
        description,
        imageURL,
        pageCount,
        this.bookShelf.length + 1
      )
    )
    this.saveCurrentLibrary()
    return true
  }

  createNewCard(newBook) {
    const cardDeck = document.querySelector(".card-deck")

    const cardTemplate = document.createElement("div")
    cardTemplate.classList.add("card")
    cardTemplate.dataset.bookId = newBook.bookID

    const cardImage = document.createElement("div")
    cardImage.classList.add("image")
    cardImage.style.backgroundImage = `url('${newBook.imageURL}')`

    const pageBackground = document.createElement("div")
    const pagePara = document.createElement("p")
    const pageText = document.createTextNode(`${newBook.pageCount} pages`)
    pagePara.appendChild(pageText)
    pageBackground.appendChild(pagePara)
    cardImage.appendChild(pageBackground)

    const bookInfo = document.createElement("div")
    bookInfo.classList.add("book-info")

    const bookTitle = document.createElement("h3")
    const titleText = document.createTextNode(newBook.title)
    bookTitle.appendChild(titleText)

    const bookAuthor = document.createElement("h3")
    const authorText = document.createTextNode(newBook.author)
    bookAuthor.appendChild(authorText)

    const bookDescription = document.createElement("p")
    const descriptionText = document.createTextNode(newBook.description)
    bookDescription.appendChild(descriptionText)

    const readButton = document.createElement("a")
    readButton.innerHTML = '<i class="fa-solid fa-check"></i>'
    if (newBook.hasRead) {
      readButton.style = "background-color: #3CCF4E; color: #FFFFFF"
    }

    const deleteButton = document.createElement("a")
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

    bookInfo.appendChild(bookTitle)
    bookInfo.appendChild(bookAuthor)
    bookInfo.appendChild(bookDescription)
    bookInfo.appendChild(readButton)
    bookInfo.appendChild(deleteButton)

    cardTemplate.appendChild(cardImage)
    cardTemplate.appendChild(bookInfo)

    cardDeck.appendChild(cardTemplate)

    readButton.addEventListener("click", (e) => {
      const bookID = parseInt(e.composedPath()[3].dataset.bookId, 10)
      this.bookShelf.forEach((book) => {
        if (book.bookID === bookID) {
          if (!book.hasRead) {
            e.composedPath()[1].style =
              "background-color: #3CCF4E; color: #FFFFFF"
            book.hasRead = true
          } else {
            e.composedPath()[1].style = "background-color: ; color: inherit;"
            book.hasRead = false
          }
        }
        this.saveCurrentLibrary()
      })
    })

    deleteButton.addEventListener("click", (e) => {
      if (window.confirm("Delete card?")) {
        this.bookShelf.forEach((book) => {
          if (book.bookID === e.composedPath()[3].dataset.bookId) {
            const bookIndex = this.bookShelf.indexOf(book)
            this.bookShelf.splice(bookIndex, 1)
          }
        })
        e.composedPath()[3].remove()
        this.saveCurrentLibrary()
      }
    })
  }

  returnTitle(title) {
    const book = fetch(
      `${this.endpoint}${title}&inTitle&orderBy=relevance&key=${this.key}`
    )
      .then((response) => response.json())
      .then((response) => {
        const bookInfo = response.items[0].volumeInfo
        const bookStuff = {
          title: bookInfo.title,
          author: bookInfo.authors[0],
          year: bookInfo.publishedDate.split("-")[0],
          description: bookInfo.description,
          imageURL: bookInfo.imageLinks.thumbnail,
          pageCount: bookInfo.pageCount,
        }

        return bookStuff
      })
    return book
  }

  countBooksRead() {
    let readBookCount = 0
    this.bookShelf.forEach((book) => {
      if (book.hasRead) readBookCount += 1
    })
    return readBookCount
  }

  countTotalPages() {
    let totalPageCount = 0
    this.bookShelf.forEach((book) => {
      totalPageCount += book.pageCount
    })
    return totalPageCount
  }

  countPagesRead() {
    let readPageCount = 0
    this.bookShelf.forEach((book) => {
      if (book.hasRead) readPageCount += book.pageCount
    })
    return readPageCount
  }
}

// experimenting with object initiation in place of class.
const sortingProto = {
  compareBooksYear(a, b) {
    if (
      document.querySelector(".sort-year-button").dataset.sortingOrder ===
      "ascending"
    ) {
      return a.year < b.year ? 1 : -1
    }
    return a.year < b.year ? -1 : 1
  },

  compareBooksAZ(a, b) {
    function checkTitle(title) {
      const thePattern = /^(\bthe\b)/i // Removes 'the' from beginning of book titles, case insensitive

      if (title.match(thePattern)) {
        title = title.substring(title.indexOf(" ") + 1)
      }

      return title
    }

    const titleA = checkTitle(a.title.toLowerCase())
    const titleB = checkTitle(b.title.toLowerCase())

    if (
      document.querySelector(".sort-az-button").dataset.sortingOrder ===
      "ascending"
    ) {
      return titleA < titleB ? 1 : -1
    }
    return titleA < titleB ? -1 : 1
  },
}

export const sortingObject = () => Object.assign(Object.create(sortingProto))
