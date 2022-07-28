const myLibrary = [];

function Book(title, author, year, description, imageURL) {
    this.title = title,
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

const daVinci = new Book(title = 'The Da Vinci Code',
                         author = 'Dan Brown',
                         year = 2006,
                         description = 'Robert Langdon, a professor who studies symbols and artifacts, chases down an age old scavenger hunt to find a secret that threatens to smash christianity wide open',
                         imageURL = 'https://images-na.ssl-images-amazon.com/images/I/A15FFg6aNLL.jpg'
);

const greatGatsby = new Book(title = 'The Great gatsby',
                             author = 'F. Scott Fitzgerald',
                             year = 1925,
                             description = 'Nick Carroway tells of his neighbour, the mysterious millionaire Jay Gatsby, and his obsession to reunite with his former lover, Nick\'s cousin',
                             imageURL = 'https://kbimages1-a.akamaihd.net/2411acbb-9daa-43fb-a5a2-a9aec064e17e/1200/1200/False/the-great-gatsby-238.jpg'
);

const robinsonCrusoe = new Book(title = 'Robinson Crusoe',
                                author = 'Daniel Defoe',
                                year = 1719,
                                description = 'Driven from a loving family and a comfortable, secure life by an unswerving compulsion for the high seas, Crusoe finds successive misfortunes and escapes culminating in near-death disaster and emerging as lone survivor.',
                                imageURL = 'https://www.booksoftitans.com/wp-content/uploads/2019/02/robinson-crusoe.jpg'
);

const gobletOfFire = new Book(title = 'Harry Potter and the Goblet of Fire',
                              author = 'J.K. Rowling',
                              year = 2000,
                              description = 'When Harry gets chosen as the fourth participant in the inter-school Triwizard Tournament, he is unwittingly pulled into a dark conspiracy that slowly unveils its dangerous agenda.',
                              imageURL = 'https://images-na.ssl-images-amazon.com/images/I/91ZXAG2umhL.jpg'
);

const bridgetJones = new Book(title = 'Bridget Jones\' Diary',
                              author = 'Helen Fielding',
                              year = 1996,
                              description = 'Written in the form of a personal diary, the novel chronicles a year in the life of Bridget Jones, a thirty-something single working woman living in London.',
                              imageURL = 'https://images.penguinrandomhouse.com/cover/9780140280098'
);

addBookToLibrary(daVinci);
addBookToLibrary(greatGatsby);
addBookToLibrary(robinsonCrusoe);
addBookToLibrary(gobletOfFire);
addBookToLibrary(bridgetJones);

// ---------- Creating initial example book objects ---------- //

function parseFormData() {
    // Retrieve form data
}

function createNewBook() {
    // Use book constructor to take data from parseDormData
    // and return a new book object
}

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
}

myLibrary.forEach(book => {
    createNewCard(book);
});

myLibrary.forEach(book => {
    createNewCard(book);
});

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
