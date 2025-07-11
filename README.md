# Smart Journal

Smart Journal is a web application that allows users to securely sign up, log in, and maintain a personal journal. The dashboard provides a personalized greeting, a theme toggle, and an overview of your journal activity. While features like mood insights, habit tracking, and daily planning are planned, the current version focuses on journaling and user authentication.

---

## Features

- **User Authentication:**
  - Secure signup and login with JWT-based authentication.
  - Passwords are hashed before storage.
  - User sessions are managed via tokens in local storage.

- **Personalized Dashboard:**
  - Greets the user by name.
  - Theme toggle (light/dark mode).
  - Logout button.
  - Displays the number of journal entries.
  - Buttons for future features: Daily Quiz, Habit Tracker, Daily Planner (currently show "coming soon" alerts).

- **Journal Entry:**
  - Create new journal entries with a title and content.
  - Word and character count as you type.
  - Error handling for empty entries.
  - Motivational quote displayed on the entry page.

- **Habit Tracker**  
  - Add/edit/delete habits  
  - Mark daily completions  
  - Visual streak tracking and weekly summaries

- **Daily Planner**  
  - CRUD tasks with time slots  
  - View daily agenda and set reminders  
  - Dashboard integration for today’s tasks

- **Daily Quiz**  
  - Daily well-being questions  
  - Stores responses and shows at-a-glance quiz stats  

*Note: Mood Insights (NLP-based sentiment & trend analysis) is planned for a future release.*


- **Backend:**
  - Built with Node.js, Express, and MongoDB.
  - REST API for authentication and journal entry management.
  - Environment variables for MongoDB URI and JWT secret.

- **Frontend:**
  - Built with React.
  - Uses React Router for navigation.
  - Responsive and modern UI.

---

## Planned Features (Not Yet Implemented)
- Mood insights and analysis.


---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB database (local or cloud, e.g., MongoDB Atlas)

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```
   node index.js
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `journal` directory:
   ```
   cd journal
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

---

## Project Structure

```
project/
  backend/      # Express backend API
  journal/      # React frontend app
```

---

## Contributing & License

- Contributions are welcome!
- Licensed under ISC.
