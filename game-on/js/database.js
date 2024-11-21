// Import functions from the Firebase SDK (using the correct version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

(function(){    
    // Firebase configuration.
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

    // Initialize Firebase.
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Initialize the database.
    const db = getDatabase(app);

    // WebRTC setup.
    const peerConnection = new RTCPeerConnection();
    let dataChannel = peerConnection.createDataChannel("game");

    // Create/Join room buttons.
    const roomCodeText = document.querySelector("#room-code");
    const roomCodeInput = document.querySelector("#room-code-input");
    const createRoomButton = document.querySelector("#create-room");
    const joinRoomButton = document.querySelector("#join-room");

    // Create a room
    createRoomButton.onclick = async () => {
        const roomCode = Math.random().toString(36).substring(2, 8);
        roomCodeText.innerHTML = "Your room code is: " + roomCode;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Set the room data in Firebase.
        const roomRef = ref(db, `rooms/${roomCode}`);
        await set(roomRef, {
            offer: JSON.stringify(peerConnection.localDescription)
        });

        // Listen for answer from the other user.
        const answerRef = ref(db, `rooms/${roomCode}/answer`);
        onValue(answerRef, async (snapshot) => {
            if (snapshot.exists()) {
                const answer = JSON.parse(snapshot.val());
                await peerConnection.setRemoteDescription(answer);
                roomCodeInput.style.borderColor = "green";
                startGame();
            }
        });
    };

    // Join a room.
    joinRoomButton.onclick = async () => {
        const roomCode = roomCodeInput.value;
        const roomRef = ref(db, `rooms/${roomCode}/offer`);
        const snapshot = await get(roomRef);

        if (snapshot.exists()) {
            const offer = JSON.parse(snapshot.val());
            await peerConnection.setRemoteDescription(offer);

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Set the answer in Firebase
            const answerRef = ref(db, `rooms/${roomCode}/answer`);
            await set(answerRef, JSON.stringify(peerConnection.localDescription));
            roomCodeInput.style.borderColor = "green";
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