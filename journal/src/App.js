import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import AuthPage from "./authPage"; 
import Dashboard from "./Dashboard";
import GettingStarted from "./GettingStarted";
import { ThemeProvider } from "./ThemeContext";
import DailyQuiz from "./DailyQuiz";
import EditEntry from "./EditEntry";
import JournalEntry from "./journalEntry";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/dashboard"
          element={
            <ThemeProvider>
              <Dashboard />
            </ThemeProvider>
          }
        />
        <Route
           path="/getting-started" element={<GettingStarted />} />
          
           
           <Route
            path="/DailyQuiz" element={<DailyQuiz />} />
            <Route path="/editEntry/:id" element={<EditEntry />} />
             <Route
           path="/journalEntry" element={<JournalEntry />} />


      </Routes>
    </Router>
  );
}

export default App;