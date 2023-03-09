import {initializeApp} from "firebase/app"
import {
    getFirestore, collection, getDocs, addDoc
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
addDoc(colRef, {
    message: "test msg",
    name:" test name"
})

getDocs(colRef)
    .then((snap) =>{
        let lisT = []
        snap.docs.forEach((doc) =>{
            lisT.push({...doc.data()})
        })
        console.log(lisT)
    })

