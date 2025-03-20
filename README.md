# 🗨️ Chat Box

## 🚀 Overview
Empower seamless real-time communication with our **Chat App Backend**, built with **Spring Boot** and **MongoDB**. This backend enables users to **create and join chat rooms**, **exchange messages in real time** using **STOMP over WebSockets**, and **manage users efficiently** through RESTful APIs.

## ✨ Key Features
- 🏠 **Create & Join Chat Rooms** – Users can create rooms or join existing ones for discussions.
- ⚡ **Real-Time Messaging** – Instant communication using **STOMP (Simple Text Oriented Messaging Protocol)** over WebSockets.
- 🗄️ **MongoDB Integration** – Fast and scalable NoSQL database for storing user and chat data.
- 🔗 **RESTful API Support** – Smooth user and room management via structured APIs.

## 🛠️ Tech Stack
- ☕ **Java**
- 🌱 **Spring Boot**
- 📡 **Spring WebSocket with STOMP**
- 🍃 **MongoDB**
- 🏗️ **Maven**

## 📌 Getting Started

### ✅ Prerequisites
Ensure you have the following installed:
- ☕ **Java (JDK 17 or later recommended)**
- 🍃 **MongoDB**, running at `mongodb://localhost:27017/chatapp`
- 🏗️ **Maven**

### ⚙️ Setup & Execution
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/chat-app-backend.git
   cd chat-app-backend
   ```
2. **Install dependencies & build the project:**
   ```bash
   mvn clean install
   ```
3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at **`http://localhost:8080/`**.

## 🔗 API Endpoints

### 👤 **User Management**
- 🔹 `POST /api/users/register` – Register a new user
- 🔹 `POST /api/users/login` – Authenticate and receive JWT token

### 💬 **Chat Room Management**
- 🏠 `POST /api/rooms` – Create a new chat room
- 📃 `GET /api/rooms` – Retrieve all chat rooms
- 🔍 `GET /api/rooms/{roomId}` – Get details of a specific chat room

### 🌍 **WebSocket Endpoints (STOMP)**
- 🔌 **Connect:** `ws://localhost:8080/chat`
- 📩 **Subscribe to a room:** `/topic/room/{roomId}`
- 📨 **Send a message:** `/app/chat/{roomId}`

## 🔮 Future Enhancements
- 🟢 **User Presence Detection** – Indicate online/offline status.
- 📜 **Message History Storage** – Persist chat history for better user experience.
- 🔔 **Push Notifications** – Notify users of new messages in real-time.
- 🎨 **UI Enhancements** – Improve user interaction and experience.

🚀 **Contribute & Enhance**: Want to improve this project? Feel free to **fork, contribute, and make an impact!** 💡

