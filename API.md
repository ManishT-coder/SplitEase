# API Documentation 📡

Complete API reference for SplitEase backend.

---

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-url.com/api
```

---

## 🔐 Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 📋 Table of Contents

- [Auth Routes](#auth-routes)
- [Group Routes](#group-routes)
- [Expense Routes](#expense-routes)
- [Settlement Routes](#settlement-routes)
- [User Routes](#user-routes)
- [Error Responses](#error-responses)

---

## 🔑 Auth Routes

### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "Manish",
  "email": "manish@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Manish",
    "email": "manish@example.com",
    "avatar": "https://ui-avatars.com/api/?name=Manish"
  }
}
```

**Error (400):**

```json
{
  "success": false,
  "error": "User already exists"
}
```

---

### Login User

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "manish@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Manish",
    "email": "manish@example.com"
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Manish",
    "email": "manish@example.com",
    "groups": ["groupId1", "groupId2"]
  }
}
```

---

## 👥 Group Routes

### Get All Groups

```http
GET /api/groups
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "count": 3,
  "groups": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Office Lunch",
      "description": "Daily lunch expenses",
      "members": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "Manish",
          "email": "manish@example.com"
        },
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Furqan",
          "email": "furqan@example.com"
        }
      ],
      "createdBy": "64f8a1b2c3d4e5f6a7b8c9d0",
      "totalExpenses": 12500,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Create Group

```http
POST /api/groups
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Trip to Goa",
  "description": "Goa trip expenses",
  "members": ["userEmail1@example.com", "userEmail2@example.com"]
}
```

**Response (201):**

```json
{
  "success": true,
  "group": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "name": "Trip to Goa",
    "description": "Goa trip expenses",
    "members": ["userId1", "userId2", "currentUserId"],
    "createdBy": "currentUserId",
    "createdAt": "2024-01-20T14:00:00.000Z"
  }
}
```

---

### Get Group Details

```http
GET /api/groups/:groupId
```

**Response (200):**

```json
{
  "success": true,
  "group": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Office Lunch",
    "members": [...],
    "expenses": [
      {
        "_id": "expenseId1",
        "description": "Lunch at cafe",
        "amount": 500,
        "paidBy": {
          "_id": "userId1",
          "name": "Manish"
        },
        "date": "2024-01-15"
      }
    ],
    "balances": {
      "Manish": 250,
      "Furqan": -250
    }
  }
}
```

---

### Update Group

```http
PUT /api/groups/:groupId
```

**Request Body:**

```json
{
  "name": "Updated Group Name",
  "description": "Updated description"
}
```

---

### Delete Group

```http
DELETE /api/groups/:groupId
```

**Response (200):**

```json
{
  "success": true,
  "message": "Group deleted successfully"
}
```

---

### Add Member to Group

```http
POST /api/groups/:groupId/members
```

**Request Body:**

```json
{
  "email": "newuser@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "group": {
    "_id": "groupId",
    "members": [..., "newUserId"]
  }
}
```

---

### Remove Member from Group

```http
DELETE /api/groups/:groupId/members/:userId
```

---

## 💰 Expense Routes

### Add Expense

```http
POST /api/expenses
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "description": "Dinner at restaurant",
  "amount": 1500,
  "groupId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "paidBy": "64f8a1b2c3d4e5f6a7b8c9d0",
  "splitAmong": ["userId1", "userId2", "userId3"],
  "category": "food",
  "date": "2024-01-20"
}
```

**Response (201):**

```json
{
  "success": true,
  "expense": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "description": "Dinner at restaurant",
    "amount": 1500,
    "paidBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Manish"
    },
    "group": "64f8a1b2c3d4e5f6a7b8c9d1",
    "splitAmong": ["userId1", "userId2", "userId3"],
    "perPerson": 500,
    "category": "food",
    "date": "2024-01-20",
    "createdAt": "2024-01-20T20:30:00.000Z"
  }
}
```

---

### Get Group Expenses

```http
GET /api/expenses/group/:groupId
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `category` | string | Filter by category |
| `startDate` | string | Filter from date |
| `endDate` | string | Filter to date |

**Example:**

```http
GET /api/expenses/group/groupId?page=1&limit=20&category=food
```

**Response (200):**

```json
{
  "success": true,
  "count": 15,
  "totalPages": 2,
  "currentPage": 1,
  "expenses": [
    {
      "_id": "expenseId1",
      "description": "Dinner at restaurant",
      "amount": 1500,
      "paidBy": {
        "_id": "userId1",
        "name": "Manish"
      },
      "splitAmong": [
        { "_id": "userId1", "name": "Manish" },
        { "_id": "userId2", "name": "Furqan" },
        { "_id": "userId3", "name": "Aisha" }
      ],
      "perPerson": 500,
      "category": "food",
      "date": "2024-01-20"
    }
  ]
}
```

---

### Update Expense

```http
PUT /api/expenses/:expenseId
```

**Request Body:**

```json
{
  "description": "Updated description",
  "amount": 1800
}
```

---

### Delete Expense

```http
DELETE /api/expenses/:expenseId
```

---

### Get Expense Summary

```http
GET /api/expenses/summary/:groupId
```

**Response (200):**

```json
{
  "success": true,
  "summary": {
    "totalExpenses": 25000,
    "averagePerPerson": 8333.33,
    "byCategory": {
      "food": 15000,
      "travel": 7000,
      "entertainment": 3000
    },
    "byMonth": {
      "2024-01": 25000
    }
  }
}
```

---

## 💸 Settlement Routes

### Calculate Settlements

```http
POST /api/settle/:groupId
```

**Response (200):**

```json
{
  "success": true,
  "settlements": [
    {
      "from": {
        "_id": "userId2",
        "name": "Furqan"
      },
      "to": {
        "_id": "userId1",
        "name": "Manish"
      },
      "amount": 500
    },
    {
      "from": {
        "_id": "userId3",
        "name": "Aisha"
      },
      "to": {
        "_id": "userId1",
        "name": "Manish"
      },
      "amount": 300
    }
  ],
  "totalTransactions": 2,
  "optimizedFrom": 4
}
```

---

### Mark Settlement as Paid

```http
PUT /api/settle/:settlementId/pay
```

**Response (200):**

```json
{
  "success": true,
  "settlement": {
    "_id": "settlementId",
    "isSettled": true,
    "settledAt": "2024-01-25T10:00:00.000Z"
  }
}
```

---

### Get Settlement History

```http
GET /api/settle/history/:groupId
```

---

## 👤 User Routes

### Get User Profile

```http
GET /api/users/profile
```

---

### Update User Profile

```http
PUT /api/users/profile
```

**Request Body:**

```json
{
  "name": "Manish Kumar",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

### Search Users

```http
GET /api/users/search?query=manish
```

**Response (200):**

```json
{
  "success": true,
  "users": [
    {
      "_id": "userId",
      "name": "Manish",
      "email": "manish@example.com"
    }
  ]
}
```

---

## ❌ Error Responses

### 400 — Bad Request

```json
{
  "success": false,
  "error": "Invalid input data",
  "details": {
    "email": "Email is required"
  }
}
```

### 401 — Unauthorized

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 — Forbidden

```json
{
  "success": false,
  "error": "You are not a member of this group"
}
```

### 404 — Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 — Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Server Error |

---

## 🧪 Testing API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Manish","email":"manish@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manish@test.com","password":"123456"}'

# Get groups (with token)
curl http://localhost:5000/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import the collection from `docs/postman-collection.json`
2. Set environment variable `baseUrl` to `http://localhost:5000/api`
3. Run requests

---

## 📚 Additional Resources

- [Authentication Guide](docs/auth-guide.md)
- [Settlement Algorithm](docs/settlement-algorithm.md)
- [Error Handling](docs/error-handling.md)
