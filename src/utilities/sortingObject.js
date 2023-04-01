// experimenting with object initiation in place of class.
const sortingProto = {
  compareBooksYear(a, b) {
    if (
      document.querySelector(".sort-year-button").dataset.sortingOrder ===
      "ascending"
    ) {
      return a.year < b.year ? 1 : -1
    }
    return a.year < b.year ? -1 : 1
  },

  compareBooksAZ(a, b) {
    function checkTitle(title) {
      const thePattern = /^(\bthe\b)/i // Removes 'the' from beginning of book titles, case insensitive

      if (title.match(thePattern)) {
        title = title.substring(title.indexOf(" ") + 1)
      }

      return title
    }

    const titleA = checkTitle(a.title.toLowerCase())
    const titleB = checkTitle(b.title.toLowerCase())

    if (
      document.querySelector(".sort-az-button").dataset.sortingOrder ===
      "ascending"
    ) {
      return titleA < titleB ? 1 : -1
    }
    return titleA < titleB ? -1 : 1
  },
}

const sortingObject = () => Object.assign(Object.create(sortingProto))
export default sortingObject
