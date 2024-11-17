// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

(function(){
    // Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyB23YHeO8FiX_ecpKRJRXhQyHFuKaS7RVc",
    authDomain: "im2-game-on--multiplayer.firebaseapp.com",
    databaseURL: "https://im2-game-on--multiplayer-default-rtdb.firebaseio.com",
    projectId: "im2-game-on--multiplayer",
    storageBucket: "im2-game-on--multiplayer.firebasestorage.app",
    messagingSenderId: "180183271025",
    appId: "1:180183271025:web:0a1eadfa91496114f73dd0",
    measurementId: "G-NJJTZPKBQC"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // WebRTC setup
    const peerConnection = new RTCPeerConnection();
    let dataChannel = peerConnection.createDataChannel("game");

    // Elements
    const roomCodeInput = document.getElementById("roomCode");
    const createRoomButton = document.getElementById("createRoom");
    const joinRoomButton = document.getElementById("joinRoom");

    // Create a room
    createRoomButton.onclick = async () => {
        const roomCode = Math.random().toString(36).substring(2, 8);
        roomCodeInput.value = roomCode;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        db.ref(`rooms/${roomCode}`).set({
            offer: JSON.stringify(peerConnection.localDescription)
        });

        // Listen for answer
        db.ref(`rooms/${roomCode}/answer`).on("value", async (snapshot) => {
            if (snapshot.exists()) {
                const answer = JSON.parse(snapshot.val());
                await peerConnection.setRemoteDescription(answer);
                startGame();
            }
        });
    };

    // Join a room
    joinRoomButton.onclick = async () => {
        const roomCode = roomCodeInput.value;
        const snapshot = await db.ref(`rooms/${roomCode}/offer`).get();

        if (snapshot.exists()) {
            const offer = JSON.parse(snapshot.val());
            await peerConnection.setRemoteDescription(offer);

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            db.ref(`rooms/${roomCode}/answer`).set(JSON.stringify(peerConnection.localDescription));
            startGame();
        } else {
            alert("Room not found!");
        }
    };

    // Handle messages
    dataChannel.onmessage = (event) => console.log("Message:", event.data);

    // Update turn state
    function startGame() {
        console.log("Game started!");
        document.getElementById("setup").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
    }
})();