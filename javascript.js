const myLibrary = [];

function Book(title, author, year, description, imageURL) {
    this.title = title.trim(),
    this.author = author,
    this.year = year,
    this.description = description,
    this.imageURL = imageURL
}

function addBookToLibrary(bookObject) {
    myLibrary.push(bookObject);
    return myLibrary;
}

// ---------- Creating initial example book objects ---------- //

addBookToLibrary(new Book(title = 'The Da Vinci Code',
                          author = 'Dan Brown',
                          year = 2003,
                          description = 'Robert Langdon, a professor who studies symbols and artifacts, chases down an age old scavenger hunt to find a secret that threatens to smash christianity wide open',
                          imageURL = 'https://images-na.ssl-images-amazon.com/images/I/A15FFg6aNLL.jpg'));

addBookToLibrary(new Book(title = 'The Great gatsby',
                          author = 'F. Scott Fitzgerald',
                          year = 1925,
                          description = 'Nick Carroway tells of his neighbour, the mysterious millionaire Jay Gatsby, and his obsession to reunite with his former lover, Nick\'s cousin',
                          imageURL = 'https://kbimages1-a.akamaihd.net/2411acbb-9daa-43fb-a5a2-a9aec064e17e/1200/1200/False/the-great-gatsby-238.jpg'));

addBookToLibrary(new Book(title = 'Robinson Crusoe',
                          author = 'Daniel Defoe',
                          year = 1719,
                          description = 'Driven from a loving family and a comfortable, secure life by an unswerving compulsion for the high seas, Crusoe finds successive misfortunes and escapes culminating in near-death disaster and emerging as lone survivor.',
                          imageURL = 'https://www.booksoftitans.com/wp-content/uploads/2019/02/robinson-crusoe.jpg'));

addBookToLibrary(new Book(title = 'Harry Potter and the Goblet of Fire',
                          author = 'J.K. Rowling',
                          year = 2000,
                          description = 'When Harry gets chosen as the fourth participant in the inter-school Triwizard Tournament, he is unwittingly pulled into a dark conspiracy that slowly unveils its dangerous agenda.',
                          imageURL = 'https://images-na.ssl-images-amazon.com/images/I/91ZXAG2umhL.jpg'));

addBookToLibrary(new Book(title = 'Bridget Jones\' Diary',
                          author = 'Helen Fielding',
                          year = 1996,
                          description = 'Written in the form of a personal diary, the novel chronicles a year in the life of Bridget Jones, a thirty-something single working woman living in London.',
                          imageURL = 'https://images.penguinrandomhouse.com/cover/9780140280098'));

// ---------- Form completion and data retrieval ---------- //

function parseFormData() {
    let titleInput = document.querySelector('#book-title');
    let authorInput = document.querySelector('#book-author');
    let yearInput = document.querySelector('#book-year');
    let descriptionInput = document.querySelector('#book-description');
    let imageInput = document.querySelector('#book-cover-url');

    let bookObject = createNewBook(titleInput.value,
                                   authorInput.value,
                                   yearInput.value,
                                   descriptionInput.value,
                                   imageInput.value
    );

    if (bookObject) {
        createNewCard(bookObject);
        cancelBookForm();
    } else {
        alert('Please complete all required form fields')
    };

    initializeDelete();
};

function createNewBook(title, author, year, description, imageURL) {
    if (!title || !author || !year || !imageURL) return null;
    const bookObject = new Book(title, author, year, description, imageURL);
    return bookObject;
};

let submitFormButton = document.querySelector('.form-buttons-container>button[type=button]')
submitFormButton.addEventListener('click', parseFormData)

function createNewCard(newBook) {
    const cardDeck = document.querySelector('.card-deck')

    const cardTemplate =  document.createElement('div');
    cardTemplate.classList.add('card');

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

    const deleteButton = document.createElement('a');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    bookInfo.appendChild(bookTitle);
    bookInfo.appendChild(bookAuthor);
    bookInfo.appendChild(bookDescription);
    bookInfo.appendChild(deleteButton);

    cardTemplate.appendChild(cardImage);
    cardTemplate.appendChild(bookInfo)

    cardDeck.appendChild(cardTemplate);

    deleteButton.addEventListener('click', (e) => {
        if (window.confirm('Delete card?')) {
            e.path[3].remove();
        };
    });
};

function initializeDelete() {
    let deleteButtons = document.querySelectorAll('.book-info>a');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (window.confirm('Delete card?')) {
                e.path[3].remove();
            };
        });
    });
}

initializeDelete();

// ---------- Form visibility functions ---------- //

function showBookForm() {
    let bookForm = document.querySelector('.book-form-background');
    if (bookForm.style.visibility != 'visible') {
        bookForm.style.visibility = 'visible';
    };
};

function cancelBookForm() {
    let bookForm = document.querySelector('.book-form-background');
    if (bookForm.style.visibility === 'visible') {
        bookForm.style.visibility = 'hidden';
    };
};

let newFormButton = document.querySelector('.add-book-button');
newFormButton.addEventListener('click', showBookForm);

let cancelFormButton = document.querySelector('button[type=reset]')
cancelFormButton.addEventListener('click', cancelBookForm)

// -------------- Book sorting functions ------------- //

function compareBooksAZ(a, b) {

    let titleA = checkTitle(a.title.toLowerCase());
    let titleB = checkTitle(b.title.toLowerCase());

    if (titleA < titleB) {
        return -1;
    } else if (titleA > titleB) {
        return 1;
    } else {
        return 0;
    };

};

function checkTitle(title) {
    let thePattern = new RegExp(/^(\bthe\b)/i);

    if (title.match(thePattern)) {
        title = title.substring(title.indexOf(' ') + 1);
    };

    return title;
}

// -------------- Example invocation ------------ //
myLibrary.forEach(book => {
    createNewCard(book);
});
myLibrary.forEach(book => {
    createNewCard(book);
});
