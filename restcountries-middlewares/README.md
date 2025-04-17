# 🌍 Secure API Middleware System

A full-stack secure API middleware system with JWT-based user authentication, API key management, and access to country data via the RestCountries API.


## 🚀 Features

### 🔐 Backend (Node.js + Express + Sequelize + SQLite)
- User registration and login with hashed passwords
- JWT-based authentication
- API key generation and management (CRUD by user)
- Secure proxy to the RestCountries API
- Usage tracking per API key

### 🌐 Frontend (React)
- User registration and login
- Dashboard to manage API keys
- Search countries using the authenticated API
- Protected routes using JWT


## 🐳 Docker Setup

### Prerequisites:
- Docker Desktop installed and running

### 📦 Build and Start
```bash
docker compose build --no-cache
docker compose up
