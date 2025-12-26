# Expense Tracker

A full-stack expense tracking application built with React and Node.js, featuring AI-powered expense predictions and comprehensive financial analytics.

## Features

- 💰 **Expense Management**: Add, edit, and delete expenses with categories
- 📊 **Interactive Dashboard**: View spending statistics and trends at a glance
- 📈 **Data Visualization**: Monthly bar charts and category pie charts
- 🤖 **AI Predictions**: Machine learning-powered expense predictions
- 🏷️ **Category Management**: Organize expenses with custom categories
- 🔐 **User Authentication**: Secure login and registration system
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React
- Vite
- Recharts (for data visualization)
- CSS3 with modern animations

### Backend
- Node.js
- Express.js
- CouchDB (database)
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- CouchDB (local or remote instance)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunal-shidling/Expense-Tracker.git
   cd expense_tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure CouchDB**
   - Install and start CouchDB
   - Create a database for the application
   - Update backend configuration with your CouchDB credentials

5. **Environment Setup**
   - Create a `.env` file in the backend directory
   - Add necessary environment variables (database URL, JWT secret, etc.)

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
expense_tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS stylesheets
│   │   └── utils/          # Helper functions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### AI Predictions
- `POST /api/ai/predict` - Get expense predictions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Kunal Shidling

## Acknowledgments

- Built with modern web technologies
- Designed with user experience in mind
- AI-powered features for smart financial planning
