import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import DisplayAllPosts from "./pages/displayAllPosts";

// Component for the landing page
const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="App">
            <h1>Welcome to ThoughtLog!</h1>
            <p>Start logging your thoughts and ideas here.</p>
            <button onClick={() => navigate("/posts")}>
                Start Browsing
            </button>

        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/posts" element={<DisplayAllPosts />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
