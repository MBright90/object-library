let myLibrary = [];

function Book(title, author, year, description, imageURL) {
    this.title = title,
    this.author = author,
    this.year = year,
    this.description = description,
    this.imageURL = imageURL
}

function addBookToLibrary(bookObject) {
    myLibrary += bookObject;
    return myLibrary;
}

function showBookForm() {
    // Change css visibility attribute to visible on click
}

function parseFormData() {
    // Retrieve form data
}

function createNewBook() {
    // Use book constructor to take data from parseDormData
    // and return a new book object
}


// Creating initial example book objects //

const daVinci = new Book('The Da Vinci Code',
                         'Dan Brown',
                         2006,
                         'Robert Langdon, a professor who studies symbols and artifacts, chases down an age old scavenger hunt to find a secret that threatens to smash christianity wide open',
                         'https://images-na.ssl-images-amazon.com/images/I/A15FFg6aNLL.jpg'
);

const greatGatsby = new Book('The Great gatsby',
                             'F. Scott Fitzgerald',
                             1925,
                             'Nick Carroway tells of his neighbour, the mysterious millionaire Jay Gatsby, and his obsession to reunite with his former lover, Nick\'s cousin',
                             'https://kbimages1-a.akamaihd.net/2411acbb-9daa-43fb-a5a2-a9aec064e17e/1200/1200/False/the-great-gatsby-238.jpg'
);

addBookToLibrary(daVinci);
addBookToLibrary(greatGatsby);

console.log(myLibrary)