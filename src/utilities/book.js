export default class Book {
  constructor(title, author, year, description, imageURL, pageCount, bookID) {
    this.title = title.trim()
    this.author = author
    this.year = year
    this.description = description
    this.imageURL = imageURL
    this.hasRead = false
    this.pageCount = pageCount || 0
    this.bookID = bookID
  }
}
