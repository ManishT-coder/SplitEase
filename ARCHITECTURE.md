# Architecture 🏗️

System architecture and design decisions for SplitEase.

---

## 🎯 Overview

SplitEase follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│                    (React.js App)                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Pages  │  │Components│  │ Context │  │ Services│       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │   Axios     │                          │
│                    │  (HTTP)     │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│                   (Node.js + Express)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Routes  │  │Controllers│ │  Models │  │Middleware│      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │   Mongoose  │                          │
│                    │   (ODM)     │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│                     (MongoDB)                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Users  │  │  Groups │  │ Expenses│  │Settlements│     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Architecture

### Frontend Components

```
src/
├── components/                    # Reusable UI
│   ├── common/                    # Generic components
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorBoundary.jsx
│   ├── layout/                    # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── expense/                   # Expense-related
│   │   ├── ExpenseCard.jsx
│   │   ├── ExpenseForm.jsx
│   │   └── ExpenseList.jsx
│   ├── group/                     # Group-related
│   │   ├── GroupCard.jsx
│   │   ├── GroupForm.jsx
│   │   └── MemberList.jsx
│   └── settlement/                # Settlement-related
│       ├── SettlementCard.jsx
│       └── BalanceChart.jsx
│
├── pages/                         # Route pages
│   ├── Dashboard.jsx
│   ├── Groups.jsx
│   ├── GroupDetail.jsx
│   ├── AddExpense.jsx
│   ├── Settlements.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── context/                       # State management
│   ├── AuthContext.jsx
│   └── GroupContext.jsx
│
├── services/                      # API layer
│   ├── api.js                     # Axios instance
│   ├── authService.js
│   ├── groupService.js
│   └── expenseService.js
│
├── hooks/                         # Custom hooks
│   ├── useAuth.js
│   ├── useGroup.js
│   └── useExpenses.js
│
├── utils/                         # Utilities
│   ├── constants.js
│   ├── helpers.js
│   └── formatters.js
│
└── App.jsx                        # Root component
```

### Backend Architecture

```
server/
├── config/                        # Configuration
│   ├── db.js                      # MongoDB connection
│   ├── env.js                     # Environment variables
│   └── cors.js                    # CORS settings
│
├── models/                        # Database schemas
│   ├── User.js
│   ├── Group.js
│   ├── Expense.js
│   └── Settlement.js
│
├── routes/                        # API routes
│   ├── index.js                   # Route aggregator
│   ├── auth.js
│   ├── groups.js
│   ├── expenses.js
│   └── settlements.js
│
├── controllers/                   # Business logic
│   ├── authController.js
│   ├── groupController.js
│   ├── expenseController.js
│   └── settlementController.js
│
├── services/                      # External services
│   ├── emailService.js
│   └── notificationService.js
│
├── middleware/                     # Middleware
│   ├── auth.js                    # JWT verification
│   ├── validate.js                # Input validation
│   ├── errorHandler.js            # Error handling
│   └── rateLimiter.js             # Rate limiting
│
├── utils/                         # Utilities
│   ├── apiResponse.js             # Standard responses
│   ├── logger.js                  # Logging
│   └── settlement算法.js          # Settlement algorithm
│
├── server.js                      # Entry point
└── package.json
```

---

## 🔄 Data Flow

### Adding an Expense

```
User clicks "Add Expense"
         │
         ▼
┌─────────────────┐
│  ExpenseForm    │  User fills form
│  (Component)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  handleSubmit() │  Validates form
│  (Page)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ expenseService  │  Calls API
│ (Service)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Axios HTTP     │  POST /api/expenses
│  Request        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express Route  │  Routes to controller
│  /api/expenses  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware │  Verifies JWT token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ expenseController│  Processes request
│  .create()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate Input │  Checks required fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Expense.create() │  Saves to MongoDB
│  (Mongoose)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update Group   │  Recalculates balances
│  Balances       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return JSON    │  Success response
│  Response       │
└─────────────────┘
```

---

## 🧮 Settlement Algorithm

### Problem

Given a group of people with debts, find the minimum number of transactions to settle all debts.

### Solution: Greedy Algorithm

```javascript
// Step 1: Calculate net balance for each person
// Step 2: Separate into debtors (negative) and creditors (positive)
// Step 3: Match largest debtor with largest creditor
// Step 4: Repeat until all settled

function calculateSettlements(balances) {
  const debtors = [];  // People who owe money
  const creditors = []; // People who are owed
  
  // Separate debtors and creditors
  for (const [person, balance] of Object.entries(balances)) {
    if (balance < 0) {
      debtors.push({ person, amount: -balance });
    } else if (balance > 0) {
      creditors.push({ person, amount: balance });
    }
  }
  
  // Sort by amount (descending)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  
  const settlements = [];
  
  // Match debtors with creditors
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: amount
    });
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }
  
  return settlements;
}
```

### Example

```
Before:
  Manish:  +500 (owed)
  Furqan:  -200 (owes)
  Aisha:   -300 (owes)

Naive approach (3 transactions):
  Furqan → Manish: 200
  Aisha → Manish: 300
  
Optimized (2 transactions):
  Furqan → Manish: 200
  Aisha → Manish: 300
  
Result: Same, but already optimal!
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                            │
└──────────────────────────────────────────────────────────┘

User enters credentials
         │
         ▼
┌─────────────────┐
│  Login Form     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /api/auth │
│  /login         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Find User by    │
│ Email           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Compare Password│
│ (bcrypt)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate JWT    │
│ Token           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Token    │
│ + User Data     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in        │
│ localStorage    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Attach to       │
│ All Requests    │
└─────────────────┘
```

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │      Group       │
├─────────────────┤         ├─────────────────┤
│ _id             │◄───────►│ _id             │
│ name            │   N:N   │ name            │
│ email           │         │ description     │
│ password        │         │ members[]       │
│ avatar          │         │ createdBy       │
│ createdAt       │         │ createdAt       │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│     Expense     │         │   Settlement    │
├─────────────────┤         ├─────────────────┤
│ _id             │         │ _id             │
│ description     │         │ from (User)     │
│ amount          │         │ to (User)       │
│ paidBy (User)   │         │ amount          │
│ group (Group)   │         │ group (Group)   │
│ splitAmong[]    │         │ isSettled       │
│ category        │         │ settledAt       │
│ date            │         │ createdAt       │
│ createdAt       │         └─────────────────┘
└─────────────────┘
```

---

## 🔧 Design Patterns

### 1. MVC (Model-View-Controller)

```
Model      → Data schema (Mongoose)
View       → React components
Controller → Business logic
```

### 2. Repository Pattern

```javascript
// services/expenseService.js
class ExpenseService {
  async create(expenseData) {
    return await Expense.create(expenseData);
  }
  
  async findByGroup(groupId) {
    return await Expense.find({ group: groupId });
  }
}

// controllers/expenseController.js
class ExpenseController {
  constructor(expenseService) {
    this.expenseService = expenseService;
  }
  
  async create(req, res) {
    const expense = await this.expenseService.create(req.body);
    res.json({ success: true, expense });
  }
}
```

### 3. Custom Hooks Pattern

```javascript
// hooks/useExpenses.js
export const useExpenses = (groupId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchExpenses();
  }, [groupId]);
  
  const fetchExpenses = async () => {
    const data = await expenseService.getByGroup(groupId);
    setExpenses(data);
    setLoading(false);
  };
  
  return { expenses, loading, refetch: fetchExpenses };
};
```

---

## 🚀 Performance Optimizations

### Frontend

| Technique | Implementation |
|-----------|----------------|
| **Lazy Loading** | `React.lazy()` for route components |
| **Memoization** | `useMemo` for expensive calculations |
| **Code Splitting** | Route-based code splitting |
| **Image Optimization** | Lazy load images, use WebP |
| **Debouncing** | Search input debouncing |

### Backend

| Technique | Implementation |
|-----------|----------------|
| **Indexing** | MongoDB indexes on frequently queried fields |
| **Pagination** | Limit results per page |
| **Caching** | Redis for frequent queries (optional) |
| **Rate Limiting** | Prevent API abuse |
| **Compression** | gzip compression |

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. HTTPS (TLS)                                         │
│     └── Encrypts data in transit                       │
│                                                         │
│  2. CORS                                                │
│     └── Only allows trusted origins                    │
│                                                         │
│  3. JWT Authentication                                  │
│     └── Stateless token-based auth                     │
│                                                         │
│  4. Password Hashing (bcrypt)                           │
│     └── Never store plain passwords                    │
│                                                         │
│  5. Input Validation                                    │
│     └── Validate all user inputs                       │
│                                                         │
│  6. Rate Limiting                                       │
│     └── Prevent brute force attacks                    │
│                                                         │
│  7. Helmet.js                                           │
│     └── Set security HTTP headers                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

### Current (MVP)

```
Single Server → MongoDB Atlas
Handle: 100-500 concurrent users
```

### Future Scaling

```
Load Balancer → Multiple Servers → MongoDB Replica Set
Handle: 10,000+ concurrent users
```

### Scaling Strategies

1. **Horizontal Scaling** — Add more servers
2. **Database Sharding** — Split data across servers
3. **CDN** — Static assets on CDN
4. **Caching** — Redis for frequently accessed data
5. **Microservices** — Split into smaller services

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                        /\                               │
│                       /  \                              │
│                      / E2E\     Few end-to-end tests    │
│                     /──────\                           │
│                    /        \                           │
│                   /Integration\   API integration tests  │
│                  /────────────\                         │
│                 /              \                         │
│                /    Unit Tests  \  Many unit tests       │
│               /──────────────────\                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Level | Tools | Coverage |
|-------|-------|----------|
| Unit | Jest | 70% |
| Integration | Supertest | 20% |
| E2E | Cypress/Playwright | 10% |

---

## 📚 References

- [MongoDB Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Authentication](https://jwt.io/introduction)
