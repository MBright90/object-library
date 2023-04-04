/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
// import { getAuth } from "firebase/compat/auth"

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  // setDoc,
  // updateDoc,
  // doc,
  // serverTimestamp,
} from "firebase/firestore"
// import Book from "./book"

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

  // addBookToLibrary(title, author, year, description, imageURL, pageCount) {
  //   this.bookShelf.push(
  //     new Book(
  //       title,
  //       author,
  //       year || null,
  //       description,
  //       imageURL,
  //       pageCount,
  //       this.bookShelf.length + 1
  //     )
  //   )
  //   this.saveCurrentLibrary()
  //   return true
  // }

  generateBookID(title) {
    return title.toLowerCase().replaceAll(" ", "_")
  }

  addBookToLibrary(title, author, year, description, imageURL, pageCount) {
    let result
    try {
      addDoc(collection(getFirestore(), "books"), {
        title,
        author,
        year,
        description,
        imageURL,
        pageCount,
        id: this.generateBookID(title),
        hasRead: false,
      })
      result = true
    } catch (error) {
      console.log("Failed to add book to library", error)
    }
    return result
  }

  // function loadMessages() {
  //   const recentMessagesQuery = query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'desc'), limit(12))

  //   onSnapshot(recentMessagesQuery, function(snapshot) {
  //     snapshot.docChanges().forEach(function(change) {
  //       if (change.type === 'removed') {
  //         deleteMessage(change.doc.id)
  //       } else {
  //         const message = change.doc.data()
  //         displayMessage(change.doc.id, message.timestamp, message.name,
  //           message.text, message.profilePic, message.imageUrl)
  //       }
  //     })
  //   })
  // }

  async deleteBook(bookID) {
    
  }

  loadBooks() {
    const bookshelfQuery = query(
      collection(getFirestore(), "books"),
      orderBy("title", "year")
    )

    onSnapshot(bookshelfQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") this.deleteBook(change.doc.id)
        else {
          const book = change.doc.data()
          console.log(book)
        }
      })
    })
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

    deleteButton.addEventListener("click", this.deleteCard)
  }

  deleteCard(e) {
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
