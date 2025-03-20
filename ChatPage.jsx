import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null); // Use useRef to manage WebSocket client

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser, navigate]);

  // Load previous messages
  useEffect(() => {
    if (!connected || !roomId) return;

    async function loadMessages() {
      try {
        const fetchedMessages = await getMessages(roomId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    loadMessages();
  }, [connected, roomId]);

  // Scroll to latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!connected || stompClientRef.current) return; // Prevent re-initialization

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      stompClientRef.current = client;
      toast.success("Connected to chat!");

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    }, (error) => {
      console.error("WebSocket connection error:", error);
      toast.error("Failed to connect to chat!");
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    };
  }, [roomId, connected]);

  // Send Message
  const sendMessage = () => {
    if (stompClientRef.current && connected && input.trim()) {
      const message = { sender: currentUser, content: input, roomId };
      stompClientRef.current.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (stompClientRef.current) stompClientRef.current.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900">
      {/* Header */}
      <header className="w-full py-5 shadow flex justify-between px-10 items-center bg-gray-800 text-white">
        <h1 className="text-lg font-semibold">Room: <span className="font-normal">{roomId}</span></h1>
        <h1 className="text-lg font-semibold">User: <span className="font-normal">{currentUser}</span></h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-full">Leave Room</button>
      </header>

      {/* Chat Messages */}
      <main ref={chatBoxRef} className="flex-1 overflow-auto px-10 py-5">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
            <div className={`my-2 ${message.sender === currentUser ? "bg-green-600" : "bg-gray-700"} p-3 max-w-xs rounded text-white`}>
              <div className="flex items-center gap-2">
                <img className="h-8 w-8 rounded-full" src="https://avatar.iran.liara.run/public/43" alt="avatar" />
                <div>
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-300">{timeAgo(message.timeStamp)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Input Section */}
      <div className="h-16 bg-gray-800 px-10 flex items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          type="text"
          placeholder="Type your message..."
          className="w-full px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none"
        />
        <button className="bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full mx-2">
          <MdAttachFile size={20} />
        </button>
        <button onClick={sendMessage} className="bg-green-600 h-10 w-10 flex justify-center items-center rounded-full">
          <MdSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
