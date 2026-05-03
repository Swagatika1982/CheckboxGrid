CheckboxGrid — Real-Time Distributed Checkbox System

Inspired by the viral “One Million Checkboxes,” this project is rebuilt as a scalable, real-time system demonstrating backend engineering and system design concepts.

Project Overview

CheckboxGrid is a real-time web application where multiple users can interact with a shared grid of checkboxes. Any change made by one user is instantly reflected for all connected users.

This project focuses less on UI and more on how systems behave under real-time interaction, concurrency, and distributed environments.

Tech Stack

  Frontend:  
    HTML, CSS, JavaScript
    WebSocket client (Socket.IO)

  Backend:
    Node.js
    Express
    Socket.IO

  Database:
    MongoDB (user authentication)

  Caching / Messaging:  
    Redis (Valkey)
    Shared state
    Pub/Sub communication

DevOps:
  Docker (MongoDB + Redis)
  PM2 (process management)
  VPS deployment (Linux)

Features Implemented:
  Real-time checkbox updates across all users
  JWT-based authentication system
  Anonymous users (read-only access)
  Authenticated users can interact
  Per-user rate limiting to prevent spam
  Redis-based shared state management
  Pub/Sub system for multi-instance scalability
  Clean modular backend structure
  
How to Run Locally:

Clone the repository:
  git clone https://github.com/YOUR_USERNAME/CheckboxGrid.git
  cd CheckboxGrid
  
Install dependencies:
  npm install

Create .env file:
  PORT=8000
  MONGO_URI=mongodb://admin:password@127.0.0.1:27017/checkboxgrid?authSource=admin
  REDIS_URL=redis://127.0.0.1:6379
  CLIENT_URL=http://localhost:8000
  JWT_ACCESS_SECRET=your_secret
  JWT_REFRESH_SECRET=your_secret

Start services:
  docker compose up -d

Run server:
  node index.js

Open browser:
  http://localhost:8000

Environment Variables Required
  PORT=8000
  MONGO_URI=your_mongodb_connection_string
  REDIS_URL=your_redis_connection_string
  CLIENT_URL=http://localhost:8000
  JWT_ACCESS_SECRET=secret
  JWT_REFRESH_SECRET=secret

Redis Setup Instructions

Redis is used for two purposes:
  Storing shared checkbox state
  Broadcasting updates across server instances

Run using Docker:
  docker compose up -d

Ensure Redis is running:
  docker ps

Default connection:
  redis://127.0.0.1:6379

Authentication Flow
  User registers with email and password
  User logs in and receives a JWT access token
  Token is stored in browser (localStorage)
  WebSocket connection sends token to server
  Server verifies token and attaches user to socket

Behavior:
Not logged in → read-only
Logged in → allowed to interact

WebSocket Flow:
  Client connects using Socket.IO
  Server establishes persistent connection
  User triggers checkbox update
  Server processes event
  Update is published to Redis
  All clients receive update instantly

This enables real-time synchronization across users.

Rate Limiting Logic

Rate limiting is implemented per user:

  Each user has a unique key in Redis
  On every action, system checks last action timestamp
  If action is too frequent → request blocked
  Redis TTL ensures automatic reset

Example behavior:

  User clicks too fast → blocked temporarily
  User waits → allowed again

This prevents abuse without affecting normal usage.

Screenshots / Demo
1.
 <img width="1050" height="904" alt="image" src="https://github.com/user-attachments/assets/a115e4f8-42f3-4f41-b4fd-6542cee4681b" />
 2. Click on Checkbox not allowed for unauthorised user...
 <img width="976" height="877" alt="image" src="https://github.com/user-attachments/assets/2a0af358-392a-4c7a-a07f-3d0a678d18a1" />
 3.
<img width="934" height="726" alt="image" src="https://github.com/user-attachments/assets/473efff4-064e-438b-95fa-38f9e684bd22" />
4. Rate limiting applied. each click waits 5 sec...
<img width="949" height="816" alt="image" src="https://github.com/user-attachments/assets/cbf5f930-4e17-4068-b814-adde0de2c4d0" />





Live Demo:

http://74.208.206.245:8000

 

What This Project Demonstrates:
  Real-time system design
  Distributed state handling
  Backend architecture thinking
  Event-driven communication
  Practical use of Redis and WebSockets
  
Author:
Swagatika Sahoo

Final Note:
This project is intentionally designed to reflect how real-world systems behave, not just how they look.
