import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import placeholderImage from "../assets/images/placeholder-profile.jpg"

export async function signIn() {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(getAuth(), provider)
}

export function signOutUser() {
  signOut(getAuth())
}

function getUserName() {
  return getAuth().currentUser.displayName
}

function getUserPicture() {
  return getAuth().currentUser.photoURL || placeholderImage
}

function isUserSignedIn() {
  return !!getAuth().currentUser
}

// Check if user is signed in, if not: show sign-in
function displayAccountStatus() {
  const signInDiv = document.querySelector(".sign-in")
  const userInfoDiv = document.querySelector(".user-info")
  const userInfoDivChildren = [...userInfoDiv.children]
  if (isUserSignedIn()) {
    // If user is signed in, display the account info div
    signInDiv.setAttribute("hidden", "true")
    userInfoDiv.removeAttribute("hidden")
    userInfoDivChildren?.forEach((child) => child.removeAttribute("hidden"))

    // Display users picture and display name
    const userProfilePic = document.querySelector(".user-pic")
    userProfilePic.style.backgroundImage = `url('${getUserPicture()}')`
    const userName = document.querySelector(".user-name")
    userName.textContent = getUserName()
  } else {
    // If user is not signed in, display sign in prompt
    userInfoDiv.setAttribute("hidden", "true")
    userInfoDivChildren?.forEach((child) =>
      child.setAttribute("hidden", "true")
    )
    signInDiv.removeAttribute("hidden")
  }
}

function displayWelcome() {
  const main = document.querySelector(".card-deck")
  const signInMain = document.querySelector(".sign-in-main")

  if (isUserSignedIn()) {
    signInMain.setAttribute("hidden", "true")
    main.classList.remove("not-logged-in")
  } else {
    signInMain.removeAttribute("hidden")
    main.classList.add("not-logged-in")
  }
}

function toggleButtonStatus() {
  const buttonArr = [
    ...document.querySelectorAll(".dropdown-container button"),
    ...document.querySelectorAll(".sidebar-buttons button"),
  ]
  const userStatus = isUserSignedIn()

  buttonArr.forEach((button) => {
    if (userStatus) button.disabled = false
    else button.disabled = true
  })
}

export function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), () => {
    displayAccountStatus()
    displayWelcome()
    toggleButtonStatus()
  })
}
