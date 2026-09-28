# SplitEase 💰

> Smart expense splitting for groups — built with MERN Stack

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

---

## 🎯 What is SplitEase?

SplitEase is a web application that helps groups track shared expenses and settle debts efficiently. No more awkward conversations about money — let the app handle the math!

### Key Features

- ✅ **Create Groups** — Add friends, family, or colleagues
- ✅ **Track Expenses** — Log who paid what for whom
- ✅ **Smart Settlement** — Minimum transactions to settle all debts
- ✅ **Real-time Updates** — See changes instantly
- ✅ **Expense History** — Track all past transactions
- ✅ **Dashboard** — Visual overview of balances

---

## 📸 Screenshots

| Dashboard | Groups | Add Expense |
|-----------|--------|-------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Groups](docs/screenshots/groups.png) | ![Add Expense](docs/screenshots/add-expense.png) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+ — [Download](https://nodejs.org/)
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud) or local
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/splitease.git
cd splitease

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

```bash
# Create .env file in server folder
cd server
cp .env.example .env

# Edit .env with your values
MONGODB_URI=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key
PORT=5000
```

### Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js 18 | UI Components |
| **Styling** | Tailwind CSS | Beautiful UI |
| **Backend** | Node.js + Express | REST API |
| **Database** | MongoDB | Data Storage |
| **Auth** | JWT + bcrypt | Authentication |
| **State** | Context API | State Management |

---

## 📁 Project Structure

```
splitease/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   ├── GroupCard.jsx
│   │   │   └── SettlementList.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── GroupDetail.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   └── Login.jsx
│   │   ├── context/           # State management
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API calls
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── server/                    # Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Group.js
│   │   └── Expense.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── groups.js
│   │   └── expenses.js
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── server.js              # Entry point
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/groups` | Get all groups |
| `POST` | `/api/groups` | Create new group |
| `GET` | `/api/groups/:id` | Get group details |
| `POST` | `/api/expenses` | Add new expense |
| `GET` | `/api/expenses/group/:id` | Get group expenses |
| `POST` | `/api/settle/:groupId` | Calculate settlements |

---

## 🧮 Settlement Algorithm

SplitEase uses a **greedy algorithm** to minimize the number of transactions:

```
Example:
- Manish owes ₹500
- Furqan owes ₹300
- Aisha is owed ₹800

Without optimization: 3 transactions
With SplitEase: 2 transactions (Manish→Aisha: ₹500, Furqan→Aisha: ₹300)
```

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Group creation
- [x] Add/edit expenses
- [x] Balance calculation
- [x] Settlement optimization

### Phase 2 (Planned)
- [ ] Real-time notifications
- [ ] Expense categories
- [ ] Monthly reports
- [ ] Currency conversion
- [ ] Export to CSV/PDF

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] AI expense suggestions
- [ ] Bill splitting by photo
- [ ] Payment gateway integration

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Manish** — [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourusername)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [MongoDB University](https://university.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
