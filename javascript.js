import APIManager from "./utilities/utilities.js";

let bookApiEndpoint = 'https://www.googleapis.com/books/v1/volumes?q=';

const librarian = new APIManager(bookApiEndpoint, 
                                 'AIzaSyCChOno95k5f75fCh9zynvxwo4qTf-5D4Q')

// ---------- Creating initial example book objects ---------- //

librarian.addBookToLibrary('The Da Vinci Code',
                           'Dan Brown',
                           2003,
                           'Robert Langdon, a professor who studies symbols and artifacts, chases down an age old scavenger hunt to find a secret that threatens to smash christianity wide open',
                           'https://images-na.ssl-images-amazon.com/images/I/A15FFg6aNLL.jpg');

librarian.addBookToLibrary('The Great gatsby',
                           'F. Scott Fitzgerald',
                           1925,
                           'Nick Carroway tells of his neighbour, the mysterious millionaire Jay Gatsby, and his obsession to reunite with his former lover, Nick\'s cousin',
                           'https://kbimages1-a.akamaihd.net/2411acbb-9daa-43fb-a5a2-a9aec064e17e/1200/1200/False/the-great-gatsby-238.jpg');

librarian.addBookToLibrary('Robinson Crusoe',
                           'Daniel Defoe',
                           1719,
                           'Driven from a loving family and a comfortable, secure life by an unswerving compulsion for the high seas, Crusoe finds successive misfortunes and escapes culminating in near-death disaster and emerging as lone survivor.',
                           'https://www.booksoftitans.com/wp-content/uploads/2019/02/robinson-crusoe.jpg');

librarian.addBookToLibrary('Harry Potter and the Goblet of Fire',
                           'J.K. Rowling',
                           2000,
                           'When Harry gets chosen as the fourth participant in the inter-school Triwizard Tournament, he is unwittingly pulled into a dark conspiracy that slowly unveils its dangerous agenda.',
                           'https://images-na.ssl-images-amazon.com/images/I/91ZXAG2umhL.jpg');

librarian.addBookToLibrary('Bridget Jones\' Diary',
                           'Helen Fielding',
                           1996,
                           'Written in the form of a personal diary, the novel chronicles a year in the life of Bridget Jones, a thirty-something single working woman living in London.',
                           'https://images.penguinrandomhouse.com/cover/9780140280098');

// ---------- Form completion and data retrieval ---------- //

const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const yearInput = document.querySelector('#book-year');
const descriptionInput = document.querySelector('#book-description');
const imageInput = document.querySelector('#book-cover-url');

function parseFormData() {
    console.log('Parsing Data')

    if (librarian.addBookToLibrary(titleInput.value,
                                   authorInput.value,
                                   yearInput.value,
                                   descriptionInput.value,
                                   imageInput.value
    )) {
        librarian.createNewCard(librarian.bookShelf[librarian.bookShelf.length - 1])
        cancelBookForm();
    } else {
        alert('Please complete all required form fields')
    };
};

let submitFormButton = document.querySelector('.form-buttons-container>button[type=button]')
submitFormButton.addEventListener('click', parseFormData);

const autofillBtn = document.querySelector('form>button');
autofillBtn.addEventListener('click', () => {
    librarian.returnTitle(titleInput.value)
        .then((response) => {
        console.log(response)
        titleInput.value = response.title;
        authorInput.value = response.author;
        yearInput.value = response.year;
        descriptionInput.value = response.description;
        imageInput.value = response.imageURL;
    })
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

let cancelFormButton = document.querySelector('button[type=reset]');
cancelFormButton.addEventListener('click', cancelBookForm);

// -------------- Book sorting functions ------------- //

function compareBooksYear(a, b) {

    if (a.year < b.year) {
        return -1;
    } else if (a.year > b.year) {
        return 1;
    } else {
        return 0;
    };
};

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
    let thePattern = new RegExp(/^(\bthe\b)/i);  // Removes 'the' from beginning of book titles, case insensitive

    if (title.match(thePattern)) {
        title = title.substring(title.indexOf(' ') + 1);
    };

    return title;
};

let sortYear = document.querySelector('.sort-year-button');
sortYear.addEventListener('click', () => {
    removeAllCards();
    librarian.bookShelf.sort(compareBooksYear).forEach(book => {
        librarian.createNewCard(book);
    })
})

let sortAZ = document.querySelector('.sort-az-button');
sortAZ.addEventListener('click', () => {
    removeAllCards();
    librarian.bookShelf.sort(compareBooksAZ).forEach(book => {
        librarian.createNewCard(book);
    });
}) ;

// ---------------- Card removal functions -------------- //


function removeAllCards() {
    let cardDeck = document.querySelectorAll('.card');
    cardDeck.forEach(card => {
        card.remove()
    });
};

// -------------- Example invocation ------------ //

librarian.bookShelf.forEach(book => {
    librarian.createNewCard(book)
});
