import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";
import { Socket } from "socket.io-client";

interface Connection {
  _id: string;
  name: string;
}

interface Message {
  sender: string;
  text: string;
  time: number;
}

interface ChatSectionProps {
  connections: Connection[];
  selected: string | null;
}

const ChatSection: React.FC<ChatSectionProps> = ({ connections, selected }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const name = connections.find((c) => c._id === selected)?.name;
  const targetUserId = connections.find((c) => c._id === selected)?._id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("authToken");

  const userId: string | undefined = currentUser?.id;
  const firstName: string | undefined = currentUser?.name;

  /* ---------------- SOCKET SETUP ---------------- */
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ sender, text }: { sender: string; text: string }) => {
      setMessages((prev) => [...prev, { sender, text, time: Date.now() }]);
    });

    socket.on("typing", ({ userId: typingUser }: { userId: string }) => {
      if (typingUser === targetUserId) setIsTyping(true);
    });

    socket.on("stopTyping", ({ userId: typingUser }: { userId: string }) => {
      if (typingUser === targetUserId) setIsTyping(false);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  /* ---------------- TYPING INDICATOR ---------------- */
  useEffect(() => {
    if (!socketRef.current || !targetUserId) return;

    if (newMessage.trim()) {
      socketRef.current.emit("typing", { userId, targetUserId });

      clearTimeout(typingTimeoutRef.current!);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("stopTyping", { userId, targetUserId });
      }, 2000);
    } else {
      socketRef.current.emit("stopTyping", { userId, targetUserId });
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [newMessage, userId, targetUserId]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const msg = {
      firstName,
      userId,
      targetUserId,
      text: newMessage,
    };

    socketRef.current.emit("sendMessage", msg);

    try {
      await fetch(`${BACKEND_URL}/message/newmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMessage, id: targetUserId }),
      });
    } catch (err) {
      console.error("Send message failed", err);
    }

    setNewMessage("");
  };

  /* ---------------- LOAD CHAT HISTORY ---------------- */
  const loadSelectedMessages = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/message/load`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Load messages failed", err);
    }
  };

  useEffect(() => {
    if (selected) loadSelectedMessages(selected);
  }, [selected]);

  /* ---------------- SCROLL TO BOTTOM ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selected]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-full w-full bg-gray-100 shadow-md">
      {/* Header */}
      <div className="bg-gray-700 text-white px-4 py-3">
        <h1 className="text-lg font-semibold">{name || "No Chat Selected"}</h1>
        {isTyping && <p className="text-xs text-gray-300 italic">typing...</p>}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
        {selected ? (
          messages.length ? (
            messages.map((msg, i) =>
              msg.sender === userId ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg max-w-[75%] sm:max-w-xs break-words">
                    {msg.text}
                    <div className="text-[10px] text-gray-200 mt-1">
                      {new Date(msg.time).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="bg-gray-300 text-black px-3 sm:px-4 py-2 rounded-lg max-w-[75%] sm:max-w-xs break-words">
                    {msg.text}
                    <div className="text-[10px] text-gray-700 mt-1">
                      {new Date(msg.time).toLocaleString()}
                    </div>
                  </div>
                </div>
              ),
            )
          ) : (
            <p className="text-center text-gray-500">No messages yet</p>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 text-base sm:text-lg">
              Select a connection to start chatting
            </p>
            <p className="text-gray-400 text-sm mt-2 lg:hidden">
              Open the menu to see your connections
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {selected && (
        <div className="p-2 sm:p-3 bg-white border-t flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base whitespace-nowrap"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
