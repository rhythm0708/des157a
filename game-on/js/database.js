// Import functions from the Firebase SDK (using the correct version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Player's rooms (created, joined).
let playerRoom = "";

// Import game.js.
import * as game from "./game.js";
import { Player } from "./player.js";
import { updateStatus, gameUIUpdate, unlockCards, displayEndScreen } from "./display.js";

// Data elements.
const serverMessage = document.querySelector("#server-message");
let role = "";
let madeMove = false;

(function(){    
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
        playerRoom = roomCode;
    
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
    
        const roomRef = ref(db, `rooms/${roomCode}`);
        await set(roomRef, {
            offer: JSON.stringify(peerConnection.localDescription),
            players: {
                host: {
                    role: "host",
                    score: 6,
                    move: null
                }
            }
        });
        // SET ROLE HOST.
        role = "host";

        const answerRef = ref(db, `rooms/${roomCode}/answer`);
        onValue(answerRef, async (snapshot) => {
            if (snapshot.exists()) {
                const answer = JSON.parse(snapshot.val());
                await peerConnection.setRemoteDescription(answer);
                roomCodeInput.style.borderColor = "green";
    
                const players = await constructPlayers(roomCode);
                if (players.length === 2) {
                    game.startGame(players); // Start game only if two players exist
                } else {
                    console.error("Game requires exactly 2 players.");
                }
            }
        });
    };
    

    // Join a room.
    joinRoomButton.onclick = async () => {
        const roomCode = roomCodeInput.value;
        playerRoom = roomCode;
    
        const playersRef = ref(db, `rooms/${roomCode}/players`);
        const snapshot = await get(playersRef);
    
        if (snapshot.exists()) {
            const playersData = snapshot.val();
            const playerCount = Object.keys(playersData).length;
    
            if (playerCount < 2) {
                const roomRef = ref(db, `rooms/${roomCode}/offer`);
                const snapshot = await get(roomRef);
    
                if (snapshot.exists()) {
                    const offer = JSON.parse(snapshot.val());
                    await peerConnection.setRemoteDescription(offer);
    
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
    
                    // Add this player to the room
                    const newPlayerRef = ref(db, `rooms/${roomCode}/players/guest`);
                    await set(newPlayerRef, {
                        role: "guest",
                        score: 6,
                        move: null
                    });
                    // SET ROLE GUEST.
                    role = "guest";
    
                    // Set the answer in Firebase
                    const answerRef = ref(db, `rooms/${roomCode}/answer`);
                    await set(answerRef, JSON.stringify(peerConnection.localDescription));

                    roomCodeInput.style.borderColor = "green";
    
                    const players = await constructPlayers(roomCode);
                    if (players.length === 2) {
                        game.startGame(players);
                    }
                } else {
                    alert("Room not found!");
                }
            } else {
                alert("This room already has 2 players!");
            }
        } else {
            alert("Room not found!");
        }
    };
    

    // Handle messages
    dataChannel.onmessage = (event) => console.log("Message:", event.data);

    // FUNCTION: Retrieve player data and instantiate Player objects.
    async function constructPlayers(roomCode) {
        // Get the reference to the room's players in Firebase.
        const playersRef = ref(db, `rooms/${roomCode}/players`);
        const snapshot = await get(playersRef);
    
        // If player data exists in the database...
        if (snapshot.exists()) {
            const playersData = snapshot.val(); // Get the player data
            const players = [];
    
            // Loop through each player's data and create a new Player object.
            for (const key in playersData) {
                const { role, score } = playersData[key];
                players.push(new Player(role, score)); // Add the Player to the array
            }
            return players; // Return the array of Player objects
        } else {
            console.error("No players found in the room!");
            return []; // Return an empty array if no players are found
        }
    }   
})();

// FUNCTION: Send move to Firebase (to other player).
async function sendMoveToFirebase(playerId, card) {
    const playerMoveRef = ref(db, `rooms/${playerRoom}/moves/${playerId}`);

    if(card == "concede") {
        await set(playerMoveRef, {
            move: 3
        });
        return;
    }

    // Get the move from the card text.
    let move = card.querySelector("p").textContent.toLowerCase();
    let moveNo = -1;
    switch(move) {
        case "rock": moveNo = 0; break;
        case "paper": moveNo = 1; break;
        case "scissors": moveNo = 2; break;
        default: alert("Invalid move!"); return;
    }

    // Set the player's move in Firebase (This will trigger the listener on the other player's side).
    await set(playerMoveRef, {
        move: moveNo
    });

    // Update the UI status to show the player has made a move.
    madeMove = false;
    updateStatus("playerMove");

    // Now listen for both players' moves.
    listenForBothPlayersMoves(playerId);
}

// FUNCTION: Check if both players have made their moves.
function listenForBothPlayersMoves(playerId) {
    const movesRef = ref(db, `rooms/${playerRoom}/moves`);

    // Listen for changes in the moves object
    onValue(movesRef, (snapshot) => {
        const movesData = snapshot.val();

        if (movesData) {
            const opponentId = playerId === "host" ? "guest" : "host";
            let opponentMove = movesData[opponentId]?.move;
            let playerMove = movesData[playerId]?.move;

            if(opponentMove === 3) {
                console.log("opponent conceded");
                let cardCounts = game.gameDataUpdate(result);
                displayEndScreen("win", cardCounts);
                game.stopMusic();
            } else if (opponentMove !== undefined && playerMove !== undefined) {
                console.log("Both players have made their moves");

                // Proceed with the game logic
                if(!madeMove) {
                    turnLogic(playerMove, opponentMove);
                }
            // If opponent has moved.
            } else if (opponentMove !== undefined) {
                // Update UI: Opponent has made their move
                updateStatus("oppMove");
            } else {
                // UI update: Waiting for the opponent's move
                console.log("Waiting for the opponent's move...");
                updateStatus("waitingForOpponent");
            }
        }
    });
}

async function turnLogic(playerMove, opponentMove) {
    // Check the result of the game round
    const result = game.checkResult(playerMove, opponentMove);

    // Update game data with result.
    let cardCounts = game.gameDataUpdate(result)
    madeMove = true;
    // UI Update.
    gameUIUpdate(result, cardCounts);

    // Check if there's a win condition
    let gameOutcome = await game.checkWin(cardCounts);
    if (gameOutcome == false) {
        // Wait 4 seconds.
        setTimeout(() => {
            // Update status.
            updateStatus("newRound");
            // Unlock cards.
            unlockCards();
            // Reset moves in FB.
            resetMovesInFirebase();
        }, 4000)
        // Continue the game
        console.log("Game continues...");
    } else if(gameOutcome == "win" || gameOutcome == "loss") {
        displayEndScreen(gameOutcome, cardCounts);
    } else {
        alert("i have failed if it reaches this point");
    }
}

// FUNCTION: Reset moves in Firebase
async function resetMovesInFirebase() {
    const movesRef = ref(db, `rooms/${playerRoom}/moves`);
    try {
        await set(movesRef, {
            host: { move: null },
            guest: { move: null },
        });
        console.log("Moves reset successfully in Firebase.");
    } catch (error) {
        console.error("Error resetting moves in Firebase:", error);
    }
}

async function updateScores(role) {
    const playerRef = ref(db, `rooms/${playerRoom}/players/${role}/score`);

    try {
        // Retrieve the current score from Firebase
        const snapshot = await get(playerRef);
        
        if (snapshot.exists()) {
            const currentScore = snapshot.val(); // Get the current score stored in Firebase
            
            // Decrement the score by 1
            let newScore = currentScore - 1;
            await set(playerRef, newScore);
            console.log(`${role}'s score updated to ${newScore}`);
        } else {
            console.error(`No score found for ${role}`);
        }
    } catch (error) {
        console.error("Error updating score:", error);
    }
}

async function getScores() {
    // References to both host and guest score locations in Firebase.
    const hostScoreRef = ref(db, `rooms/${playerRoom}/players/host/score`);
    const guestScoreRef = ref(db, `rooms/${playerRoom}/players/guest/score`);
    
    try {
        // Retrieve both host and guest scores.
        const hostSnapshot = await get(hostScoreRef);
        const guestSnapshot = await get(guestScoreRef);

        // Check if both scores exist.
        if (hostSnapshot.exists() && guestSnapshot.exists()) {
            const hostScore = hostSnapshot.val();
            const guestScore = guestSnapshot.val();
            
            // Return the scores as an object
            return { hostScore, guestScore };
        } else {
            console.error("Scores not found for one or both players.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving scores:", error);
        return null;
    }
}

export { role, sendMoveToFirebase, listenForBothPlayersMoves, updateScores, getScores };