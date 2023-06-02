import React, { useState, useEffect, useRef } from "react";
import { sendRequest } from "../../utilities/users/send-request";
import "./Chat.css";
import ChatHeader from "../../components/ChatHeader/ChatHeader.jsx";
import Message from "../../components/Message/Message.jsx";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GifIcon from "@mui/icons-material/Gif";

function Chat({ selectedRoom, socket, user }) {
    const [input, setInput] = useState("");
    const [msgs, setMsgs] = useState([]);
    const [roomMessages, setRoomMessages] = useState({});

    async function getMessages() {
        console.log("📍 getMessages() function in Chat.jsx");
        if (selectedRoom.name) {
            console.log(
                `getMessages in chat.jsx says the selectedRoom name is: ${selectedRoom.name}`
            );
            const msgLog = await sendRequest(
                `/api/messages/${selectedRoom.id}`
            );
            console.log(`getMessages() function in Chat.jsx msgLog: ${msgLog}`);
            setMsgs(msgLog);
            return;
        }
        console.log(
            "❓ getMessages() function in Chat.jsx says no room has been selected"
        );
    }

    // const socketRef = useRef();
    const roomIdRef = useRef();

    useEffect(() => {
        if (selectedRoom.name) {
            getMessages();
            // Set the room ID so it can be accessed inside socket callbacks
            roomIdRef.current = selectedRoom.id;

            // Connect the socket to the server
            // socket.connect();

            // Set up the event listeners for the selected room
        }
        socket.on("newMsg", (msg) => {
            // if (msg.roomId === roomIdRef.current) {
            // }
            const newMsg = { text: msg };
            setMsgs((msgs) => [...msgs, newMsg]);
        });

        return () => {
            socket.off("newMsg");
            // socket.disconnect();
        };
    }, [selectedRoom, getMessages, socket]);

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        console.log("📍 handleSubmit() in Chat.jsx");
        e.preventDefault();

        const newMsg = { text: input };
        // roomId: selectedRoom.id place this in next to text input

        setMsgs((msgs) => [...msgs, newMsg]);
        // 💡 to server.js > io.on > socket.on
        socket.emit("sendMsg", input);
        console.log(newMsg);

        setInput("");
    }

    return (
        <div className="chat">
            <ChatHeader
                channel={selectedRoom.name ? selectedRoom.name : null}
            />

            <div className="chat_messages">
                {/* pass luke msgs state down as a prop */}
                {msgs.map((msg) => {
                    return <Message msg={msg} user={user} />;
                })}
            </div>
            <div className="chat_input">
                <AddCircleIcon fontSize="large" id="add-circle-icon" />
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder={`Message #${selectedRoom?.name || ""}`}
                        value={input}
                        onChange={handleChange}
                    />
                    <button className="chat_inputButton" type="submit">
                        Send Message
                    </button>
                </form>
                <div className="chat_inputIcons">
                    <CardGiftcardIcon fontSize="large" />
                    <GifIcon fontSize="large" />
                    <EmojiEmotionsIcon fontSize="large" />
                </div>
            </div>
        </div>
    );
}

export default Chat;
