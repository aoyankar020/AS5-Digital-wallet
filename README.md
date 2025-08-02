# 🎯 PROJECT OVERVIEW

This Application is a secure, modular, and role-based backend API for a DIGITAL WALLET SYSTEM (similar to Bkash or Nagad) using Express.js and Mongoose.
In this application users can register, manage wallets, and perform core financial operations such as add money, withdraw, and send money.

## ⚙️ TECHNOLOGIES USED

✅ Node js
✅ Express JS
✅ TypeScript
✅ Mongodb
✅ JWT Token
✅ Validation - ZOD , Mongoose
✅ Hashing - bcryptjs
✅ ect...

## 📝 WHAT HAVE I ENSURED ?

🔐 Authentication
🎭 Role-based Authorization
🏦 Wallet Management Logic
🧱 Transactional Logic
📦 Modular Code Architecture
🔁 Proper API Endpoints

## 📌 FEATURES

✅ JWT-based login system with three roles: admin, user, agent
✅ Secure password hashing (using bcrypt or other appropiate way)
✅ Each user and agent must have a wallet automatically created at registration (e.g., initial balance: ৳50)
✅ Users are able to:
Add money (top-up)
Withdraw money
Send money to another user
View transaction history
✅ Agents are able to:
Add money to any user's wallet (cash-in)
Withdraw money from any user's wallet (cash-out)
View their commission history (optional)
✅ Admins are able to:
View all users, agents, wallets and transactions
Block/unblock user wallets
Approve/suspend agents
✅ All transactions are being stored and trackable
✅ Role-based route protection have been implemented

# END POINTS

## 👤 USER :

🔗 Regester: http://localhost:3000/api/wallet/v1/user/regester
🔗 Add Money: http://localhost:3000/api/wallet/v1/user/add-money
🔗 Withdraw Money: http://localhost:3000/api/wallet/v1/user/withdraw
🔗 Send Money: http://localhost:3000/api/wallet/v1/user/send-money
🔗 Transaction History: http://localhost:3000/api/wallet/v1/user/transaction-history
🔗 Personal Wallet: http://localhost:3000/api/wallet/v1/user/wallet
🔗 New Token: http://localhost:3000/api/wallet/v1/user/newusertoken

## 👤 AGENT :

🔗 Regester: http://localhost:3000/api/wallet/v1/agent/regester
🔗 Cash-In: http://localhost:3000/api/wallet/v1/agent/cash-in
🔗 Cash-Out: http://localhost:3000/api/wallet/v1/agent/cash-out
🔗 Personal Transaction History: http://localhost:3000/api/wallet/v1/agent/transaction-history
🔗 Personal Wallet: http://localhost:3000/api/wallet/v1/agent/wallet
🔗 New Token: http://localhost:3000/api/wallet/v1/agent/newagenttoken

## 👤 ADMIN :

🔗 Check All Users: http://localhost:3000/api/wallet/v1/admin/users
🔗 Check All Agents: http://localhost:3000/api/wallet/v1/admin/agents
🔗 Approve Agent : http://localhost:3000/api/wallet/v1/admin/approve/agent
🔗 Block Wallet : http://localhost:3000/api/wallet/v1/admin/approve/wallet
🔗 Check All Transaction Histories: http://localhost:3000/api/wallet/v1/admin/transaction-history
🔗 Check All Wallets: http://localhost:3000/api/wallet/v1/admin/wallets

## 🛫 LOGIN :

🔗 User Login: http://localhost:3000/api/wallet/v1/auth/login/user
🔗 Agent Login:http://localhost:3000/api/wallet/v1/auth/login/agent

📒 Admin can be follow first one to continue with this credentials email:admin@gmail.com & password:admin
