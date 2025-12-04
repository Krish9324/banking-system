# 🏦 Simple Banking System

A full-stack banking application built with **Node.js**, **React**, and **PostgreSQL**, following the **MVC (Model-View-Controller)** architecture pattern. This system provides secure authentication, account management, and transaction processing for both customers and bankers.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)

## ✨ Features

### Customer Features
- 🔐 **Secure Authentication**: Sign up and login with email/password
- 💰 **Account Management**: View account balance and transaction history
- 📥 **Deposit Funds**: Add money to your account
- 📤 **Withdraw Funds**: Withdraw money with balance validation
- ⚠️ **Insufficient Funds Protection**: Prevents overdrafts with clear error messages

### Banker Features
- 🔐 **Role-Based Access**: Separate login for bankers
- 👥 **Customer Management**: View all customer accounts
- 📊 **Transaction History**: Detailed view of customer transactions
- 🔍 **Account Insights**: Monitor account balances and activity

### Security Features
- 🔒 **Password Hashing**: Bcrypt encryption for secure password storage
- 🎫 **Token-Based Authentication**: 36-character alphanumeric access tokens
- 🛡️ **Role-Based Authorization**: Protected routes based on user roles
- 🔐 **Session Management**: Secure session handling with expiration

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Bcrypt.js for password hashing
- **Security**: CORS enabled, token-based auth

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3

## 🏗️ Architecture

This project follows the **MVC (Model-View-Controller)** architecture pattern:

```
┌─────────────────────────────────────────┐
│           Frontend (React)              │
│  ┌──────────┐  ┌──────────────────┐   │
│  │   View   │  │  React Router    │   │
│  │ (Pages)  │  │  (Navigation)     │   │
│  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
                  │
                  │ HTTP Requests
                  ▼
┌─────────────────────────────────────────┐
│        Backend (Express.js)             │
│  ┌──────────┐  ┌──────────────────┐   │
│  │Controller│  │   Middleware      │   │
│  │ (Routes) │  │  (Auth, CORS)     │   │
│  └──────────┘  └──────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌──────────────────────────────────┐   │
│  │         Model (Prisma)           │   │
│  │    Database Operations           │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   PostgreSQL    │
         │    Database     │
         └────────────────┘
```

### Components Breakdown

- **Model**: Prisma ORM handles all database interactions
- **View**: React components render the UI
- **Controller**: Express routes and controllers handle business logic

## 🗄️ Database Schema

The application uses PostgreSQL with the following schema:

### Tables

#### `User`
- Stores customer and banker information
- Fields: `id`, `name`, `email`, `password` (hashed), `role`, `createdAt`
- Roles: `CUSTOMER`, `BANKER`

#### `Account`
- Stores customer account information
- Fields: `id`, `accountNumber`, `balance`, `userId`, `createdAt`
- Automatically created for new customers

#### `Transaction`
- Logs all deposits and withdrawals
- Fields: `id`, `type` (DEPOSIT/WITHDRAW), `amount`, `accountId`, `createdAt`
- Maintains complete audit trail

#### `Session`
- Manages user authentication tokens
- Fields: `id`, `token`, `userId`, `createdAt`, `expiresAt`
- Tokens expire after 24 hours

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/simple-banking-system.git
cd simple-banking-system
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Or create manually

# Configure your .env file
DATABASE_URL="postgresql://username:password@localhost:5432/Bank?schema=public"
PORT=4000

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start the server
npm run start
# Or for development with auto-reload
npm run dev
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

### Step 4: Create Your First Account

1. Navigate to the signup page
2. Create a customer account
3. Login with your credentials
4. Start making transactions!

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

#### `POST /api/auth/login`
Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "token": "abc123def456ghi789jkl012mno345pqr",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

### Customer Endpoints

All customer endpoints require `Authorization` header with the token.

#### `GET /api/customer/accounts`
Get all accounts for the logged-in customer.

**Headers:**
```
Authorization: <token>
```

#### `GET /api/customer/accounts/:accountId`
Get specific account with transaction history.

#### `POST /api/customer/accounts/:accountId/deposit`
Deposit funds into account.

**Request Body:**
```json
{
  "amount": 1000
}
```

#### `POST /api/customer/accounts/:accountId/withdraw`
Withdraw funds from account.

**Request Body:**
```json
{
  "amount": 500
}
```

**Error Response (Insufficient Funds):**
```json
{
  "message": "Insufficient Funds"
}
```

### Banker Endpoints

All banker endpoints require `Authorization` header with banker token.

#### `GET /api/banker/customers`
Get all customers with their account information.

#### `GET /api/banker/customers/:userId/accounts`
Get all accounts and transaction history for a specific customer.

## 📁 Project Structure

```
simple-banking-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/             # Database migrations
│   ├── src/
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.js
│   │   │   ├── customerController.js
│   │   │   └── bankerController.js
│   │   ├── middleware/             # Custom middleware
│   │   │   └── authMiddleware.js
│   │   ├── routes/                 # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   └── bankerRoutes.js
│   │   ├── prismaClient.js         # Prisma client instance
│   │   └── server.js               # Express server setup
│   ├── package.json
│   └── .env                        # Environment variables (not in git)
├── frontend/
│   ├── src/
│   │   ├── pages/                  # React page components
│   │   │   ├── Signup.jsx
│   │   │   ├── CustomerLogin.jsx
│   │   │   ├── BankerLogin.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   └── BankerDashboard.jsx
│   │   ├── api.js                  # Axios configuration
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── styles.css              # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚢 Deployment

### Backend Deployment (Example: Railway/Render)

1. **Set Environment Variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PORT`: Server port (usually auto-assigned)

2. **Build Commands:**
   ```bash
   npm install
   npx prisma migrate deploy
   npx prisma generate
   npm run start
   ```

### Frontend Deployment (Example: Vercel/Netlify)

1. **Build Command:**
   ```bash
   npm run build
   ```

2. **Output Directory:**
   ```
   dist
   ```

3. **Environment Variables:**
   - Update `api.js` baseURL to your backend URL

### Database Deployment

For production, use managed PostgreSQL services like:
- **Neon** (Serverless PostgreSQL)
- **Supabase**
- **Railway**
- **Render**

## 📸 Screenshots

### Customer Dashboard
- View account balance
- See transaction history
- Deposit and withdraw funds

### Banker Dashboard
- View all customers
- Monitor account activity
- Access detailed transaction logs

## 🔮 Future Enhancements

- [ ] Email notifications for transactions
- [ ] Multi-currency support
- [ ] Account statements (PDF export)
- [ ] Transaction search and filtering
- [ ] Two-factor authentication (2FA)
- [ ] Account transfer between users
- [ ] Interest calculation
- [ ] Admin dashboard with analytics
- [ ] Mobile responsive improvements
- [ ] Unit and integration tests

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js community
- React team
- Prisma team
- PostgreSQL community

---

**Note**: This is a demonstration project. For production use, implement additional security measures, error handling, logging, and comprehensive testing.

