/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
// import { getAuth } from "firebase/compat/auth"

import { getAuth } from "firebase/auth"

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
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
      const usersBookShelf = collection(userBookRef, "books")

      const querySnapshot = await getDocs(query(usersBookShelf))
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
    cardTemplate.dataset.readStatus = newBook.hasRead

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

    readButton.addEventListener("click", this.updateReadStatus)
    deleteButton.addEventListener("click", this.deleteBook)
  }

  async updateReadStatus(e) {
    const card = e.composedPath()[3]
    const { bookId, readStatus } = card.dataset

    try {
      const { currentUser } = getAuth()
      const docRef = doc(
        getFirestore(),
        "users",
        currentUser.uid,
        "books",
        bookId
      )

      if (readStatus === "false") {
        // When setting book to has been read, update database doc and
        // update color of check mark
        updateDoc(docRef, {
          hasRead: true,
        })
        card.dataset.readStatus = true
        e.composedPath()[1].style = "background-color: #3CCF4E; color: #FFFFFF"
      } else {
        // When setting book to has not been read, update database doc and
        // update color of check mark
        updateDoc(docRef, {
          hasRead: false,
        })
        card.dataset.readStatus = false
        e.composedPath()[1].style = "background-color: ; color: inherit;"
      }
    } catch (error) {
      console.log("Could not update read status", error)
    }
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

  async getCurrentStats() {
    const { currentUser } = getAuth()
    let stats

    try {
      const userBookRef = doc(getFirestore(), "users", currentUser.uid)
      const usersBookShelf = collection(userBookRef, "books")

      const querySnapshot = await getDocs(query(usersBookShelf))

      // Working out stats from query
      const allBooks = querySnapshot.docs.map((bookDoc) => ({
        ...bookDoc.data(),
      }))

      const onlyBooksRead = allBooks?.filter((book) => book.hasRead === true)

      const bookCount = allBooks.length
      const booksRead = onlyBooksRead.length
      const totalPages = allBooks?.reduce(
        (total, book) => total + book.pageCount,
        0
      )
      const pagesRead = onlyBooksRead?.reduce(
        (total, book) => total + book.pageCount,
        0
      )
      stats = { bookCount, booksRead, totalPages, pagesRead }
    } catch (error) {
      console.log("Users stats could not be retrieved: ", error)
      stats = { bookCount: 0, booksRead: 0, totalPages: 0, pagesRead: 0 }
    }
    return stats
  }
  // async getUsersBooks() {
  //   const { currentUser } = getAuth()
  //   // Return false if not logged in
  //   if (!currentUser) return []

  //   try {
  //     const userBookRef = doc(getFirestore(), "users", currentUser.uid)
  //     const usersBookshelf = collection(userBookRef, "books")

  //     const querySnapshot = await getDocs(query(usersBookshelf))
  //     const books = querySnapshot.docs.map((bookDoc) => ({
  //       ...bookDoc.data(),
  //       userRef: bookDoc.id,
  //     }))
  //     return books
  //   } catch (error) {
  //     console.log("Users bookshelf could not be retrieved:", error)
  //     return []
  //   }
  // }

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
