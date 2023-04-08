# object-library

## Hosted on firebase:
To access the main build version of this site, complete with Google sign in:
https://reading-library-3b437.web.app/

## Github Pages Demo
To access a demo version of this site, using local storage:
https://mbright90.github.io/object-library/

# Original ReadMe

### The following are thoughts written post initial creation, prior to implementing webpack and firebase.

At the outset of this project, I wanted to push myself to learn and implement some new concepts within javascript. The first step i took in completing this project was making a drawing of how I wanted it to look. From the beginning, my vision was always to have a static header and sidebar, and a deck of cards which scrolled depending on the amount of books. I felt confident in completing the aesthetic of the website and so initially created the layout out using flex box and grid. I hardcoded a set of cards in to the html so I could properly structure and test how responsive they were.

I created a library array and book constructor, and moved my hard coded books to javascript, initiating them in the run script and made a function to create and display the html elements, including a delete. This was a good reminder of how to use the appendChild function. This also allowed me to clean up the html as I could remove the hardcoded cards. I then added two sorting functions to change the order of the cards depending on different criteria.

My next challenge was to implement a form that allowed the user to add their own books to the library. I did not want the form to clutter up the page so created a function to show the form when the user chose to in addition to being able to clear and cancel the form. Early on, I wanted the completion of the form to be as simple as possible, as I was aware that copying an image address and writing a description for each book was time consuming and had the potential to turn users away. To capture the best of both worlds I wanted an option for users to be able to completely customize their cards or use an autofill feature to help them. After some research on available APIs, the Google Books API seemed like the best option, although it can return some unusual choices when using the autofill feature. As this is a project for my portfolio, I wanted the implementation of the API to be the focus. As it is currently set up, the user is able to autofill and then edit any fields they feel are necessary. Although I had some experience using APIs in python, this was my first time exploring its use as a front end technology.

In implementing the API call, I chose to use a class to handle this. In thinking about the organization of my code I created a utilities folder and .js document and built the class within this. I then needed to research and understand how to import this class to my main javascript document. The main difficulty I came across here was an error that stated the module could not be used in the current run state. I solved this by running a live-server through npm in the terminal to simulate the needed conditions. I then moved several of the book focused functions to the new class as a librarian.

I also wanted the user to be able to tick off books that they had read. So I added a tick anchor tag on the card that would show a green background when clicked. After implementing this idea, one bug that came up in testing was when sorting the cards, the tick would disappear. The reason for this was that although the tick would turn green on clicking, this was only recorded on the anchor tag element itself and not the library array of books. This meant that when the cards were restructured (which involved removing and rebuilding all of the cards), the history of whether that element had been clicked on or not was lost. My solution to this was to add a book-id dataset variable to each card which would identify the book on the card, and a hasRead attribute on each book object, that would tell the card being created whether the symbol needed to show it as having been read.

The final major bug I came across in the development of this project was when deleting a card prior to sorting the deck, the deleted card would reappear when sorting. This was because although the card had been deleted, the book shelf entry had not been. Upon investigation, this had been because I used an if statement that used strict comparison, and the event.composedPath()[3].book.bookId was returning a string, which was compared to the integer bookID. I chose to use a non strict comparison (==) which then solved this issue and successfully deleted the book item from the book shelf array.

If creating this project for deployment, I would aim to use sql to store a database of books for different users, so that they could revisit their personal library and make persistent edits.

----- Original README -----

Creating a system to add and temporarily store book information. Project to practice using object javascript constructors and prototype.
