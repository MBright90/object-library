export function appendChildren(parent, ...children) {
  children.forEach((child) => parent.append(child))
}

// Stats utilities //

const totalBooksPara = document.querySelector(".total-books")
const booksReadPara = document.querySelector(".books-read")
const totalPagesPara = document.querySelector(".total-pages")
const pagesReadPara = document.querySelector(".pages-read")

export async function updateStats(currentStats) {
  totalBooksPara.textContent = currentStats.bookCount
  booksReadPara.textContent = currentStats.booksRead
  totalPagesPara.textContent = currentStats.totalPages
  pagesReadPara.textContent = currentStats.pagesRead
}

export function showStatsPage(statsPage) {
  if (statsPage.style.visibility !== "visible") {
    statsPage.style.visibility = "visible"
  }
}
