import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar"; //

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleForm = () => {
        setIsLogin((prev) => !prev);
    };

    const handleAuthButtonClick = (isLoginForm) => {
        setIsLogin(isLoginForm);
        setShowAuthModal(true);
    };

    const handleCloseAuthModal = () => {
        setShowAuthModal(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
    };

    return (
        <Router>
            {isLoggedIn && <Navbar handleSignOut={handleSignOut} />}
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <div className="text-center mt-5">
                                <h1>Welcome to our exercise website!</h1>
                                <h1>On this site you can practice math questions at different levels of difficulty, earn points and improve each time.</h1>
                                <h1>Every 10 points the difficulty level will increase.</h1>
                                <h1>To Start go to Dashboard</h1>
                            </div>
                        ) : (
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ height: "100vh", backgroundPosition: "center" }}
                            >
                                <div className="user-register">
                                    <button
                                        className="btn btn-primary mx-2"
                                        onClick={() => handleAuthButtonClick(true)}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className="btn btn-secondary mx-2"
                                        onClick={() => handleAuthButtonClick(false)}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        )
                    }
                />
                <Route
                    path="/Dashboard"
                    element={isLoggedIn ? <Dashboard handleSignOut={handleSignOut} /> : <RedirectToLogin />}
                />
                <Route
                    path="/Profile"
                    element={isLoggedIn ? <Profile handleSignOut={handleSignOut} /> : <RedirectToLogin />}
                />
            </Routes>

            <Modal show={showAuthModal} onHide={handleCloseAuthModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center mb-4">
                        <img
                            className="user"
                            src="https://i.ibb.co/yVGxFPR/2.png"
                            alt="User"
                            height="100px"
                            width="100px"
                        />
                    </div>
                    <div className={`form ${isLogin ? "sign-in" : "sign-up"}`}>
                        {isLogin ? (
                            <Login
                                toggleForm={toggleForm}
                                setIsLoggedIn={setIsLoggedIn}
                                closeModal={handleCloseAuthModal}
                            />
                        ) : (
                            <Register
                                toggleForm={toggleForm}
                                setIsLoggedIn={setIsLoggedIn}
                                closeModal={handleCloseAuthModal}
                            />
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </Router>
    );
}

const RedirectToLogin = () => (
    <div className="text-center mt-5">
        <h1>You need to login to access this page</h1>
    </div>
);

export default App;
