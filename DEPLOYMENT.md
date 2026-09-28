# Deployment Guide 🚀

Step-by-step guide to deploy SplitEase to production.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Domain & SSL](#domain--ssl)
- [Post Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🔍 Overview

### Deployment Stack (Free Tier)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Vercel** | Frontend hosting | ✅ Unlimited |
| **Render** | Backend hosting | ✅ 750 hrs/month |
| **MongoDB Atlas** | Database | ✅ 512MB |
| **Cloudflare** | DNS + CDN | ✅ Free |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User → Cloudflare → Vercel (React)                     │
│                    ↘                                    │
│                      Render (Node.js API)               │
│                       ↘                                 │
│                         MongoDB Atlas                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] Render account ([render.com](https://render.com))
- [ ] MongoDB Atlas account ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- [ ] Domain name (optional)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/splitease.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your `splitease` repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Click **"Deploy"**

### Step 3: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-api.onrender.com/api
```

### Step 4: Custom Domain (Optional)

1. Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## ⚙️ Backend Deployment (Render)

### Step 1: Prepare Backend

Ensure your `server/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Step 2: Create Web Service

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `splitease-api`
   - **Region:** Singapore (or nearest)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Click **"Create Web Service"**

### Step 3: Set Environment Variables

In Render dashboard → Environment:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitease
JWT_SECRET=your-production-secret-key
CLIENT_URL=https://your-app.vercel.app
PORT=10000
```

### Step 4: Note Your API URL

Your API will be available at:
```
https://splitease-api.onrender.com
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Click **"Build a Database"**
4. Choose **M0 Sandbox** (Free)
5. Select region (closest to your users)
6. Click **"Create Cluster"**

### Step 2: Create Database User

1. Security → Database Access
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password
5. Click **"Add User"**

### Step 3: Whitelist IP Addresses

1. Security → Network Access
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database user password

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/splitease?retryWrites=true&w=majority
```

---

## 🔐 Environment Variables

### Complete List

```env
# ==================
# Server
# ==================
NODE_ENV=production
PORT=10000

# ==================
# MongoDB
# ==================
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/splitease

# ==================
# Authentication
# ==================
JWT_SECRET=your-super-long-random-secret-key
JWT_EXPIRE=7d

# ==================
# CORS
# ==================
CLIENT_URL=https://your-app.vercel.app

# ==================
# Email (Optional)
# ==================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Generate JWT Secret

```bash
# Run in terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Domain & SSL

### Option 1: Free Domain

1. Get free domain from [Freenom](https://www.freenom.com)
2. Or use [nip.io](https://nip.io) for local testing

### Option 2: Paid Domain

1. Buy from [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com)
2. Cost: ~₹500-1000/year

### SSL Certificate

Vercel and Render provide free SSL certificates automatically.

---

## ✅ Post Deployment

### Step 1: Test All Features

- [ ] User registration works
- [ ] User login works
- [ ] Can create groups
- [ ] Can add expenses
- [ ] Settlements calculate correctly
- [ ] Dashboard loads properly

### Step 2: Set Up Monitoring

**Health Check Endpoint:**

```javascript
// server.js
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

### Step 3: Set Up Error Tracking

Use [Sentry](https://sentry.io) (free tier):

```bash
npm install @sentry/node
```

```javascript
// server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployment

Vercel and Render auto-deploy on push to `main`:

```
git push origin main
         │
         ▼
┌─────────────────┐
│  GitHub Actions  │ (optional)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Deploy  │ (Frontend)
└─────────────────┘

┌─────────────────┐
│  Render Deploy  │ (Backend)
└─────────────────┘
```

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd server && npm install
      - run: cd server && npm test
      - run: cd client && npm install
      - run: cd client && npm test
```

---

## 💰 Cost Estimation

### Free Tier (Recommended for Start)

| Service | Cost |
|---------|------|
| Vercel | $0 |
| Render | $0 (750 hrs/month) |
| MongoDB Atlas | $0 (512MB) |
| **Total** | **$0** |

### Paid Tier (When Scaling)

| Service | Cost |
|---------|------|
| Vercel Pro | $20/month |
| Render Starter | $7/month |
| MongoDB M10 | $57/month |
| Domain | ~₹500/year |
| **Total** | **~₹7000/month** |

---

## 🔧 Troubleshooting

### Problem: CORS Error

**Solution:** Check `CLIENT_URL` in backend environment matches frontend URL.

### Problem: API Not Connecting

**Solution:** Check:
1. Backend is running (check Render logs)
2. API URL is correct in frontend
3. MongoDB connection is working

### Problem: Build Fails

**Solution:**
```bash
# Test locally first
cd client
npm run build

cd ../server
npm install
```

### Problem: Database Connection Fails

**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Verify username/password
3. Check connection string format

### Problem: App Sleeps (Render Free Tier)

**Solution:** Render free tier sleeps after 15 mins of inactivity. First request takes ~30 seconds to wake up. Consider:
1. Upgrade to paid tier
2. Use [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes

---

## 📊 Performance Optimization

### Frontend

```javascript
// Lazy load routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Optimize images
<img loading="lazy" src="image.jpg" alt="..." />
```

### Backend

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use(express.static('build', { maxAge: '1h' }));
```

---

## 🔒 Security Checklist

- [ ] Environment variables are set
- [ ] JWT secret is strong and random
- [ ] MongoDB password is strong
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] HTTPS is enforced
- [ ] Sensitive data is not in code

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Render Deployment Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Node.js Production Best Practices](https://blog.risingstack.com/node-js-best-practices-for-production)

---

## 🆘 Need Help?

1. Check [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/yourusername/splitease/issues)
3. Create an issue with `deployment` label

---

**Happy Deploying! 🚀**
