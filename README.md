CheckboxGrid

Real-time Distributed Checkbox Synchronization using Socket.IO & Redis

🌌 Overview

CheckboxGrid is a real-time, distributed system that keeps a grid of checkboxes perfectly synchronized across multiple users and multiple servers.

Inspired by the concept of “1 Million Checkboxes”, this project goes beyond a simple UI—it demonstrates how modern systems handle real-time state sharing, horizontal scaling, and event-driven communication.

✨ Key Features
⚡ Real-time updates across all connected clients
🔄 Multi-server synchronization using Redis Pub/Sub
🌐 Horizontally scalable architecture
🧠 Centralized state management using Redis
🔌 WebSocket-based communication via Socket.IO
📦 Clean separation of frontend, backend, and messaging layers
🧱 Architecture
          ┌───────────────┐
          │   Browser     │
          │ (Client UI)   │
          └──────┬────────┘
                 │ WebSocket (Socket.IO)
        ┌────────▼────────┐
        │   Node Server   │ (Port 8000)
        └────────┬────────┘
                 │
         Redis Pub/Sub + Storage
                 │
        ┌────────▼────────┐
        │   Node Server   │ (Port 9000)
        └────────┬────────┘
                 │
          ┌──────▼────────┐
          │   Browser     │
          └───────────────┘
How It Works

A user clicks a checkbox
Client emits event → server (client:checkbox:change)
Server:
Updates state in Redis
Publishes event via Redis Pub/Sub
Other servers receive event
All clients get updated instantly via Socket.IO
🛠️ Tech Stack
Node.js – backend runtime
Express.js – HTTP server
Socket.IO – real-time communication
Redis / Valkey – state storage + Pub/Sub messaging
Docker (optional) – containerized setup
📂 Project Structure
CheckboxGrid/
│
├── public/              # Frontend (HTML, CSS, JS)
├── index.js             # Main server (Express + Socket.IO)
├── redis-connection.js  # Redis clients (pub/sub + storage)
├── docker-compose.yml   # Redis/Valkey setup
├── package.json
└── README.md
🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/CheckboxGrid.git
cd CheckboxGrid
2. Install dependencies
npm install
3. Start Redis (Docker)
docker compose up -d
4. Run the server
node index.js

Or run multiple servers:

PORT=8000 node index.js
PORT=9000 node index.js
5. Open in browser
http://localhost:8000
http://localhost:9000

👉 Try clicking checkboxes in both tabs — they stay in sync 🔥

📡 API Endpoints
Health Check
GET /health

Response:

{ "healthy": true }
Get Checkbox State
GET /checkboxes

Response:

{
  "checkboxes": [true, false, ...]
}
⚠️ Challenges Solved
1. ❌ Local State Problem

Each server had its own memory → inconsistent UI
✅ Solved using Redis as shared state

2. ❌ Pub/Sub is not storage

Redis Pub/Sub only broadcasts events
✅ Added Redis key-value storage for persistence

3. ❌ Async bugs ([object Promise])

Forgetting await caused JSON parsing errors
✅ Proper async handling implemented

4. ❌ Multi-server inconsistency

Different ports not syncing
✅ Redis Pub/Sub ensures event propagation

📈 Scaling Strategy

This system is designed to scale horizontally:

Add more Node servers behind a load balancer
Use Redis as central state + messaging layer
Maintain stateless servers
🔐 Future Improvements
🚦 Rate limiting using Redis
🔒 Authentication & user sessions
📊 Metrics & monitoring
🧵 Conflict resolution (race conditions)
☁️ Deploy to cloud (AWS / GCP / Vercel)
🎯 Why This Project Matters

This project demonstrates real-world backend engineering concepts:

Event-driven architecture
Distributed systems thinking
Real-time data synchronization
State consistency across nodes

👉 These are core skills for modern backend & full-stack roles

🙌 Acknowledgements

Inspired by the concept of “1 Million Checkboxes”
Built as a learning and system design exploration project

⭐ Show Your Support

If you found this project useful:

⭐ Star the repo
🍴 Fork it
🧠 Use it to learn system design
👤 Author

S. Sahoo
Software Developer | System Design Learner | Builder
