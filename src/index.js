import {initializeApp} from "firebase/app"
import {
    getFirestore, collection, getDocs, addDoc, onSnapshot, query, orderBy, limit, where, serverTimestamp
} from "firebase/firestore"
import {formatDistanceToNow,formatRelative, subDays} from "date-fns"

// You shod write your configuration here !!!!
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
// initializing firebase cloud db
initializeApp(firebaseConfig);
const db = getFirestore()
const colRef = collection(db, "chat")

const userInputMsg = document.querySelector("#usr")
const userName = document.querySelector(".new-name")
const chatList = document.querySelector(".messages-chat")

//listen for name updating
userName.addEventListener("submit", evt => {
    evt.preventDefault()
    let newUser = userName.querySelector("#name").value
    let localNewUser = localStorage.setItem("name", newUser)
    console.log(newUser)
    userName.reset()
})



const currentRoom = document.querySelector(".chat-rooms");
let room = "#general"

function loadMessages(room) {
    // Create the query to load the last 10 messages and listen for new ones.
    const recentMessagesQuery = query(collection(getFirestore(), 'chat'), where("room", "==", room), limit(10), orderBy("timestamp", "asc"));
    onSnapshot(recentMessagesQuery, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
                //insert html with user data
                let injectHtml = `
              <li class="message text-only">
                 <span class="text"><strong>${change.doc.data()["name"]}:  </strong></span>
                <span class="text">${change.doc.data()["message"]}</span></li>
                <p class="time">${formatDistanceToNow(change.doc.data()["timestamp"].toDate(),{addSuffix:true})}</p> `
                chatList.innerHTML += injectHtml;

            }
        })
    })
}
//update chat according to room
currentRoom.addEventListener("click", evt => {
    room = evt.target.textContent
    chatList.innerHTML = ""
    loadMessages(room)
})

userInputMsg.addEventListener("submit", evt => {
    evt.preventDefault();
    let msg = userInputMsg.querySelector("input")
    //check if we have any name value which stored from the last session
    let name = localStorage.name ? localStorage.name : "anon"
    //add user data to firebase db
    addDoc(colRef, {
        message: msg.value,
        name: name,
        timestamp: serverTimestamp(),
        room: room
    })
    userInputMsg.reset()
})



