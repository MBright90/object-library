/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
// import { getAuth } from "firebase/compat/auth"

import { getAuth } from "firebase/auth"

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  // setDoc,
  // updateDoc,
  // doc,
  // serverTimestamp,
} from "firebase/firestore"

export default class APIManager {
  constructor(endpoint, key) {
    this.endpoint = endpoint
    this.key = key
    this.bookShelf = []
  }

  generateBookID(title) {
    return title.toLowerCase().replaceAll(" ", "_")
  }

  addBookToLibrary(title, author, year, description, imageURL, pageCount) {
    const { currentUser } = getAuth()

    // Return false if not logged in
    if (!currentUser) return false

    try {
      const usersBookshelf = collection(
        doc(getFirestore(), "users", currentUser.uid),
        "books"
      )
      addDoc(usersBookshelf, {
        title,
        author,
        year,
        description,
        imageURL,
        pageCount,
        bookID: this.generateBookID(title),
        hasRead: false,
      })
      return true
    } catch (error) {
      console.log("Failed to add book to library", error)
    }
    return false
  }

  async getUsersBooks() {
    const { currentUser } = getAuth()
    // Return false if not logged in
    if (!currentUser) return []

    try {
      const userBookRef = doc(getFirestore(), "users", currentUser.uid)
      const usersBookshelf = collection(userBookRef, "books")

      const querySnapshot = await getDocs(query(usersBookshelf))
      const books = querySnapshot.docs.map((bookDoc) => ({
        ...bookDoc.data(),
        userRef: bookDoc.id,
      }))
      return books
    } catch (error) {
      console.log("Users bookshelf could not be retrieved:", error)
      return []
    }
  }

  createNewCard(newBook) {
    console.log(newBook)
    const cardDeck = document.querySelector(".card-deck")

    const cardTemplate = document.createElement("div")
    cardTemplate.classList.add("card")
    cardTemplate.dataset.bookId = newBook.userRef

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

    deleteButton.addEventListener("click", this.deleteBook)
  }

  async deleteBook(e) {
    const card = e.composedPath()[3]
    const { bookId } = card.dataset

    if (window.confirm("Delete Book?")) {
      try {
        const { currentUser } = getAuth()
        const docRef = doc(
          getFirestore(),
          "users",
          currentUser.uid,
          "books",
          bookId
        )

        await deleteDoc(docRef)
        card.remove()
      } catch (error) {
        console.log("Book could not be deleted", error)
      }
    }
  }

  // Autofill the title using google books API
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

  // TODO!
  // Update functions to retrieve stats from database and use reduce to work out

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
