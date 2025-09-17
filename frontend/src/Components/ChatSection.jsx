import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";

const ChatSection = ({ connections, selected }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const name = connections.find((c) => c._id === selected)?.name;
  const targetUserId = connections.find((c) => c._id === selected)?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser.id;
  const firstName = currentUser.name;
  const token = localStorage.getItem("authToken");

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ sender, firstName, text }) => {
      setMessages((prev) => [...prev, { sender, text, time: Date.now() }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = { firstName, userId, targetUserId, text: newMessage };
    socketRef.current.emit("sendMessage", msg);

    try {
      const res = await fetch(`${BACKEND_URL}/api/msg/newmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMessage, id: targetUserId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.log(err);
        alert("Error sending");
      }
    } catch (error) {
      console.log(error);
    }

    setNewMessage("");
  };

  const loadSelectedMessages = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/msg/load`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      }
      console.log(data.messages);
      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!selected) return;
    loadSelectedMessages(selected);
  }, [selected]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-100  shadow-md">
      <div className="heading bg-gray-700 text-white px-4 py-3  flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {name ? name : "No Chat Selected"}
        </h1>
      </div>

      <div className="chat flex-1 p-4 overflow-y-auto space-y-3">
        {selected ? (
          messages.length > 0 ? (
            messages.map((msg, i) =>
              msg.sender === userId ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                    {msg.text}
                    <div className="text-gray-200 text-[10px] justify-end">
                      <p>{new Date(msg.time).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="bg-gray-300 text-black px-4 py-2 rounded-lg max-w-xs">
                    {msg.text}
                    <div className="text-gray-800 text-[10px] justify-end">
                      <p>{new Date(msg.time).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="flex justify-center text-gray-500">
              No messages yet
            </div>
          )
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Select a connection to start chatting
          </p>
        )}
      </div>

      {selected && (
        <div className="p-3 bg-white border-t flex items-center gap-2 rounded-b-lg">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
