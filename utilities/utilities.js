export class APIManager {
    constructor(endpoint, key) {
        this.endpoint = endpoint,
        this.key = key
        this.bookShelf = [];
    };

    saveCurrentLibrary() {
        let currentLibrary = JSON.stringify(this.bookShelf);
        window.localStorage.setItem('userLibrary', currentLibrary); // Saving library state in local storage
    }

    addBookToLibrary(title, author, year, description, imageURL, pageCount) {
        console.log(`AddBookToLibrary: ${pageCount}`)
        this.bookShelf.push(new Book(title,
                                     author,
                                     year || null,
                                     description,
                                     imageURL,
                                     pageCount,
                                     this.bookShelf.length + 1               
        ));
        console.log(this.bookShelf[this.bookShelf.length - 1].pageCount)
        this.saveCurrentLibrary();
        return true;
    };

    createNewCard(newBook) {
        const cardDeck = document.querySelector('.card-deck')
    
        const cardTemplate =  document.createElement('div');
        cardTemplate.classList.add('card');
        cardTemplate.dataset.bookId = newBook.bookID;
    
        const cardImage = document.createElement('div');
        cardImage.classList.add('image');
        cardImage.style.backgroundImage = `url('${newBook.imageURL}')`;
    
        const bookInfo = document.createElement('div');
        bookInfo.classList.add('book-info');
    
        const bookTitle = document.createElement('h3');
        const titleText = document.createTextNode(newBook.title);
        bookTitle.appendChild(titleText);
        
        const bookAuthor = document.createElement('h3');
        const authorText = document.createTextNode(newBook.author);
        bookAuthor.appendChild(authorText);
        
        const bookDescription = document.createElement('p');
        const descriptionText = document.createTextNode(newBook.description);
        bookDescription.appendChild(descriptionText);
    
        const readButton = document.createElement('a');
        readButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        if (newBook.hasRead) {
            readButton.style = 'background-color: #3CCF4E; color: #FFFFFF';
        };
    
        const deleteButton = document.createElement('a');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    
        bookInfo.appendChild(bookTitle);
        bookInfo.appendChild(bookAuthor);
        bookInfo.appendChild(bookDescription);
        bookInfo.appendChild(readButton);
        bookInfo.appendChild(deleteButton);
    
        cardTemplate.appendChild(cardImage);
        cardTemplate.appendChild(bookInfo)
    
        cardDeck.appendChild(cardTemplate);
    
        readButton.addEventListener('click', (e) => {
            let bookID = parseInt(e.composedPath()[3].dataset.bookId);
            this.bookShelf.forEach(book => {
                console.log(book.bookID);
                console.log(bookID);
                if (book.bookID === bookID) {
                    if (!book.hasRead) {
                        e.composedPath()[1].style= 'background-color: #3CCF4E; color: #FFFFFF';
                        book.hasRead = true;
                    } else {
                        e.composedPath()[1].style = 'background-color: ; color: inherit;';
                        book.hasRead = false;
                    };
                };
            this.saveCurrentLibrary();
            });
        });
    
        deleteButton.addEventListener('click', (e) => {
            if (window.confirm('Delete card?')) {
                console.log(this.bookShelf);
                this.bookShelf.forEach(book => {
                    if (book.bookID == e.composedPath()[3].dataset.bookId) {
                        let bookIndex = this.bookShelf.indexOf(book);
                        this.bookShelf.splice(bookIndex, 1);
                    }
                })
                e.composedPath()[3].remove();
                this.saveCurrentLibrary();
            };
        });
    };

    returnTitle(title) {
        let book = fetch(`${this.endpoint}${title}&inTitle&orderBy=relevance&key=${this.key}`)
            .then(response => response.json())
            .then((response) => {
                let bookInfo = response.items[0].volumeInfo;

                console.log(`Page Count: ${bookInfo.pageCount}`)

                let bookStuff =  {
                    title: bookInfo.title,
                    author: bookInfo.authors[0],
                    year: bookInfo.publishedDate.split('-')[0],
                    description: bookInfo.description,
                    imageURL: bookInfo.imageLinks.thumbnail,
                    pageCount: bookInfo.pageCount
                };

                return bookStuff;
            });
            console.log(book)
        return book;
    };

    countBooksRead() {
        let readBookCount = 0;
        console.log(this.bookShelf);
        this.bookShelf.forEach(book => {
            if (book.hasRead) readBookCount++;
        })
        console.log(readBookCount)
        console.log(this.bookShelf)
        return readBookCount;
    };

    countTotalPages() {
        let totalPageCount = 0;
        this.bookShelf.forEach(book => {
            totalPageCount += book.pageCount;
        })
        return totalPageCount;
    };

    countPagesRead() {
        let readPageCount = 0;
        this.bookShelf.forEach(book => {
            if (book.hasRead) readPageCount += book.pageCount;
        })
        return readPageCount;
    };

};

class Book {
    constructor(title, author, year, description, imageURL, pageCount, bookID) {
        this.title = title.trim(),
        this.author = author,
        this.year = year,
        this.description = description,
        this.imageURL = imageURL,
        this.hasRead = false,
        this.pageCount = pageCount || 0,
        this.bookID = bookID
    };
};

// experimenting with object initiation in place of class.
const sortingProto = {

    compareBooksYear(a, b) {

        if (document.querySelector('.sort-year-button').dataset.sortingOrder === 'ascending') {
            return a.year < b.year ? 1 : -1;
        } else {
            return a.year < b.year ? -1 : 1;
        }
    },
    
    compareBooksAZ(a, b) {

        function checkTitle(title) {
            let thePattern = new RegExp(/^(\bthe\b)/i);  // Removes 'the' from beginning of book titles, case insensitive
        
            if (title.match(thePattern)) {
                title = title.substring(title.indexOf(' ') + 1);
            };
        
            return title;
        }
    
        let titleA = checkTitle(a.title.toLowerCase());
        let titleB = checkTitle(b.title.toLowerCase());
    
        if (document.querySelector('.sort-az-button').dataset.sortingOrder === 'ascending') {
            return titleA < titleB ? 1 : -1;
        } else {
            return titleA < titleB ? -1 : 1;
        }     
    },
}

export const sortingObject = () => Object.assign(Object.create(sortingProto))