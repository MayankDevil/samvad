
## 🟢 How It Works

### 1. **Server Side (Node.js + Socket.io)**

* We use **Express** to serve our frontend files (HTML, CSS, JS).
* We use **Socket.io** to create a **real-time connection** between server and all connected users.
* When a user sends a message, the server **receives it** and then **sends it to everyone**.

👉 Think of the server like a **post office**:

* Users send messages to the server.
* The server delivers that message to everyone else.

---

### 2. **Client Side (HTML + JS)**

* User types a message and clicks **Send**.
* The client JS uses `socket.emit("chatMessage", msg)` to send message to server.
* When server sends messages back, the client listens with `socket.on("chatMessage", ...)` and shows it on the screen.

👉 Think of the browser as a **walkie-talkie**:

* Whatever you say goes to the server.
* Server broadcasts it to all other walkie-talkies.

---

## 🟢 The Flow in 4 Steps

1. User connects → `io.on("connection")`
2. User sends message → `socket.emit("chatMessage", msg)`
3. Server gets it → `socket.on("chatMessage", msg)`
4. Server broadcasts → `io.emit("chatMessage", msg)`

---

## 🟢 Example in Real Life

* Imagine a **group WhatsApp**:

  * Everyone is inside the group (connected users).
  * If you type a message, it goes to WhatsApp server.
  * Then server pushes it to all other group members.

rooms {
  'pbulic' : room {
    name : 'pbulic',
    members[]
    chats[]
  }
}