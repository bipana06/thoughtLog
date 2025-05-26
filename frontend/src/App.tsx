import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import DisplayAllPosts from "./pages/displayAllPosts";
import MyPage from "./pages/myPage";
import SignInWithGoogle from "./pages/sign-in-with-google";
import NewPostForm from "./pages/new-post-form";
import Signup from "./pages/signup";

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

        <div className="fixed inset-0 -z-10 h-full w-full bg-white">
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
        </div>

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/posts" element={<DisplayAllPosts />} />
                <Route path="/signin-with-google" element={<SignInWithGoogle/>} />
                <Route path="/my-page" element={<MyPage/>} />
                <Route path="/new-post-form" element={<NewPostForm/>} />
                <Route path="/signup" element={<Signup />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};


export default App;
