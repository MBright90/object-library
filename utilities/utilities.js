export default class APIManager {
    constructor(endpoint, key) {
        this.endpoint = endpoint,
        this.key = key
        this.bookShelf = [];
    };

    addBookToLibrary(title, author, year, description, imageURL) {
        this.bookShelf.push(new Book(title,
                                     author,
                                     year || null,
                                     description,
                                     imageURL                  
        ));
        let currentLibrary = JSON.stringify(this.bookShelf);
        window.localStorage.setItem('userLibrary', currentLibrary) // Saving library state in local storage
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
                if (book.bookID === bookID) {
                    if (!book.hasRead) {
                        e.composedPath()[1].style= 'background-color: #3CCF4E; color: #FFFFFF';
                        book.hasRead = true;
                    } else {
                        e.composedPath()[1].style = 'background-color: ; color: inherit;';
                        book.hasRead = false;
                    };
                };
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
            };
        });
    };

    returnTitle(title) {
        let book = fetch(`${this.endpoint}${title}&inTitle&orderBy=relevance&key=${this.key}`)
            .then(response => response.json())
            .then((response) => {
                let bookInfo = response.items[0].volumeInfo;

                let bookStuff =  {
                    title: bookInfo.title,
                    author: bookInfo.authors[0],
                    year: bookInfo.publishedDate.split('-')[0],
                    description: bookInfo.description,
                    imageURL: bookInfo.imageLinks.thumbnail
                };

                return bookStuff;
            });
        return book;
    };

};

let bookIDCreator = 0;

class Book {
    constructor(title, author, year, description, imageURL) {
        this.title = title.trim(),
        this.author = author,
        this.year = year,
        this.description = description,
        this.imageURL = imageURL,
        this.hasRead = false,
        this.bookID = bookIDCreator + 1,
        bookIDCreator += 1
    };
};