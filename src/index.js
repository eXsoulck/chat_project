import {initializeApp} from "firebase/app"
import {
    getFirestore, collection, getDocs, addDoc, onSnapshot, serverTimestamp, query, orderBy, limit, where
} from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyDktEjxL2gKjh7KroVKkNE3uFebWhsBqQU",
    authDomain: "chatroom-293fd.firebaseapp.com",
    projectId: "chatroom-293fd",
    storageBucket: "chatroom-293fd.appspot.com",
    messagingSenderId: "982794611788",
    appId: "1:982794611788:web:edd642b23840c02db018e9",
    measurementId: "G-N7LEMQTE6C"
};

initializeApp(firebaseConfig);
const db = getFirestore()
const colRef = collection(db, "chat")
const userInputMsg = document.querySelector("#usr")
const userName = document.querySelector(".new-name")
const chatList = document.querySelector(".messages-chat")

let localNewUser = []
userName.addEventListener("submit", evt => {
    evt.preventDefault()
    let newUser = userName.querySelector("#name").value
    localNewUser = newUser
    console.log(localNewUser)
    userName.reset()
})

const now = new Date()
const currentRoom = document.querySelector(".chat-rooms");
let room = "#general"

function loadMessages(room) {
    // Create the query to load the last 10 messages and listen for new ones.
    const recentMessagesQuery = query(collection(getFirestore(), 'chat'), where("room", "==", room), limit(10));
    onSnapshot(recentMessagesQuery, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
                let injectHtml = `
              <li class="message text-only">
                 <span class="text"><strong>${change.doc.data()["name"]}:  </strong></span>
                <span class="text">${change.doc.data()["message"]}</span></li>
                <p class="time">${now.toTimeString()}</p> `
                chatList.innerHTML += injectHtml;

            }
        })
    })
}

currentRoom.addEventListener("click", evt => {
    room = evt.target.textContent
    chatList.innerHTML = ""
    loadMessages(room)

})
userInputMsg.addEventListener("submit", evt => {
    evt.preventDefault();
    let msg = userInputMsg.querySelector("input")
    let name = ""
    if (localNewUser.length === 0) {
        name = "anon";
    } else {
        name = localNewUser
    }

    addDoc(colRef, {
        message: msg.value,
        name: name,
        timestamp: now.toTimeString(),
        room: room

    })
    userInputMsg.reset()

})



