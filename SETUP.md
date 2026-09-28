# Setup Guide 🛠️

Step-by-step guide to set up SplitEase on your local machine.

---

## 📋 Prerequisites

Before you start, make sure you have:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v20+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **MongoDB** | v7+ | [mongodb.com](https://www.mongodb.com/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## 🚀 Quick Setup (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/splitease.git
cd splitease
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Setup Environment Variables

```bash
cd ../server
cp .env.example .env
```

Edit `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/splitease

# For MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitease

# JWT Secret (generate your own)
JWT_SECRET=your-super-secret-key-here

# Server Port
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 5. Start the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

### 6. Open Browser

Go to: [http://localhost:3000](http://localhost:3000)

🎉 **Done!** SplitEase is now running on your machine.

---

## 📦 Detailed Setup

### Step 1: Install Node.js

```bash
# Check if Node.js is installed
node --version
# Should show: v20.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/).

### Step 2: Install MongoDB

**Option A: Local MongoDB**

1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service

```bash
# Check if MongoDB is running
mongosh
# Should connect to MongoDB shell
```

**Option B: MongoDB Atlas (Recommended)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Paste in `.env` file as `MONGODB_URI`

### Step 3: Install VS Code Extensions

Recommended extensions:

| Extension | Purpose |
|-----------|---------|
| **ES7+ React/Redux/React-Native snippets** | React shortcuts |
| **Prettier** | Code formatting |
| **ESLint** | Code linting |
| **MongoDB for VS Code** | Browse database |
| **Tailwind CSS IntelliSense** | Tailwind autocomplete |

### Step 4: Configure VS Code

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

---

## 🗄️ Database Setup

### Collections

SplitEase uses these MongoDB collections:

```
users
├── _id
├── name
├── email
├── password (hashed)
├── avatar
├── createdAt
└── updatedAt

groups
├── _id
├── name
├── description
├── members[] (user IDs)
├── createdBy
├── createdAt
└── updatedAt

expenses
├── _id
├── description
├── amount
├── paidBy (user ID)
├── group (group ID)
├── splitAmong[] (user IDs)
├── category
├── date
├── createdAt
└── updatedAt

settlements
├── _id
├── group (group ID)
├── from (user ID)
├── to (user ID)
├── amount
├── isSettled
├── createdAt
└── updatedAt
```

### Seed Data (Optional)

```bash
cd server
npm run seed
```

This creates test users and sample data.

---

## 🔧 Environment Variables

### Complete `.env` Example

```env
# ==================
# MongoDB
# ==================
MONGODB_URI=mongodb://localhost:27017/splitease

# ==================
# Authentication
# ==================
JWT_SECRET=my-super-secret-key-123
JWT_EXPIRE=7d

# ==================
# Server
# ==================
PORT=5000
NODE_ENV=development

# ==================
# CORS
# ==================
CLIENT_URL=http://localhost:3000

# ==================
# Email (Optional)
# ==================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Run Specific Tests

```bash
# Run auth tests
cd server
npm test -- --grep "auth"

# Run expense tests
cd server
npm test -- --grep "expense"
```

---

## 🐛 Troubleshooting

### Problem: `Cannot find module`

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: `MongoDB connection failed`

```bash
# Check if MongoDB is running
# Windows: Services → MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Problem: `Port already in use`

```bash
# Find process using port
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Problem: `CORS error`

Check `CLIENT_URL` in `.env` matches your frontend URL.

### Problem: `npm install` fails

```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

---

## 📱 Mobile Testing

To test on mobile device:

1. Make sure phone and laptop are on same WiFi
2. Find your laptop's IP address:

```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

3. Open React app on phone:
```
http://YOUR_IP_ADDRESS:3000
```

---

## 🚀 Production Build

### Build Frontend

```bash
cd client
npm run build
# Creates build/ folder
```

### Run Production Server

```bash
cd server
NODE_ENV=production node server.js
```

---

## 📚 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run build` | Build for production |
| `npm run seed` | Add sample data |

---

## ❓ Still Stuck?

1. Check [README.md](README.md)
2. Search existing [Issues](https://github.com/yourusername/splitease/issues)
3. Create a new issue with `help wanted` label

---

**Happy Coding! 🚀**
