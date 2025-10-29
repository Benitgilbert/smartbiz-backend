# SmartBiz Backend

SmartBiz is a secure, scalable e-commerce backend built with Node.js, Express, and MongoDB. It powers a business-oriented platform with role-based access, customizable products, and guest checkout support — designed for real-world impact.

## 🚀 Features

- 🔐 JWT-based authentication and secure password hashing
- 🧑‍💼 Role-based access control (admin, cashier, inventory, delivery, customer)
- 🛒 Product management with support for customizable inputs
- 📦 Order tracking and delivery logic (planned)
- 📊 Analytics-ready structure for business insights
- 🧪 Protected routes and middleware enforcement
- 🌍 Built for deployment on platforms like Render or Railway

## 🧱 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcrypt
- **Dev Tools**: Nodemon, dotenv
- **Version Control**: Git & GitHub

## 📦 Installation

```bash
git remote add origin https://github.com/Benitgilbert/smartbiz-backend.git
cd smartbiz-backend
npm install
npm run dev


smartbiz-backend/
├── controllers/
│   └── authController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── server.js
└── .env


🧑‍💻 Author
Benit Gilbert
Bachelor’s in Software Engineering — Rwanda
Focused on backend mastery, business logic, and scalable architecture.

📌 Roadmap
- [x] User authentication & role management
- [ ] Product model & CRUD routes
- [ ] Order system with delivery tracking
- [ ] Analytics dashboard
- [ ] Deployment & CI/CD integration

📜 License
This project is open-source and available under the MIT License.

