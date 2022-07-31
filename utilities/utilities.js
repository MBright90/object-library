export default class APIManager {
    constructor(endpoint, key) {
        this.endpoint = endpoint,
        this.key = key
    };

    returnTitle(title) {
        let book = fetch(`${this.endpoint}${title}:inauthor:orderBy=relevance&key=${this.key}`)
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