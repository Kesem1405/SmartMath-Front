import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure this is properly loaded
import { Modal } from "react-bootstrap"; // For the feedback modal

function Dashboard( handleSignOut ) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [difficulty] = useState("1");
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Debugging log to check modal feedback state
    useEffect(() => {
        if (feedback) {
            console.log("Feedback state updated: ", feedback); // Check if feedback is being set
            setShowFeedbackModal(true); // Trigger modal when feedback is updated
        }
    }, [feedback]);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            setError(null);
            setFeedback(null);

            const response = await axios.get(`http://localhost:8080/user/math/generate-question/${difficulty}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setCurrentQuestion(response.data);
            setTimer(0);
            setIsTimerRunning(true);
        } catch (err) {
            console.error("Error fetching question:", err);
            setError(err.response?.data || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [difficulty]);

    const handleAnswerChange = (event) => {
        setUserAnswer(event.target.value);
    };

    const handleSubmitAnswer = () => {
        setIsTimerRunning(false);

        if (!currentQuestion) return;

        if (!userAnswer.trim()) {
            setFeedback("Please enter an answer before submitting.");
            return;
        }

        const correctAnswer = parseInt(currentQuestion.answer, 10);
        const userAnswerNumber = parseInt(userAnswer, 10);

        if (userAnswerNumber === correctAnswer) {
            setScore((prevScore) => prevScore + 1);
            setStreak((prevStreak) => prevStreak + 1);
            setFeedback("Correct! Well done.");
            setShowFeedbackModal(true);
        } else {
            setStreak(0);
            setFeedback(`Incorrect! The correct answer was ${correctAnswer}.`);
            setShowFeedbackModal(true);
        }

        setUserAnswer(""); // Clear the answer field
        fetchQuestion();
    };

    const handleCloseModal = () => {
        setShowFeedbackModal(false);
    };

    return (
        <div>
            <Navbar handleSignOut={handleSignOut} />
            <div className="dashboard-container">
                <div className="card shadow-lg p-4">
                    <div className="d-flex justify-content-between">
                        <p className="text-secondary mb-4">Current Difficulty: <strong>{difficulty}</strong></p>
                    </div>
                    <h2 className="text-center mb-4">Math Questions</h2>
                    <p className="text-center text-secondary mb-4">Score: {score} | Streak: {streak} | Time: {timer}s</p>
                    {loading && <div className="text-center">Loading question...</div>}
                    {error && <div className="text-danger text-center">Error: {error}</div>}
                    {currentQuestion && (
                        <div>
                            <h4 className="text-center mb-3" style={{ fontSize: "1.75rem" }}>{currentQuestion.question}</h4>
                            <div className="input-group my-3">
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={handleAnswerChange}
                                    className="form-control"
                                    placeholder="Enter your answer"
                                />
                                <button onClick={handleSubmitAnswer} className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                            {feedback && (
                                <div className={`text-center mt-3 ${feedback.includes("Correct") ? "text-success" : "text-danger"}`}>
                                    {feedback}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for feedback */}
            <Modal show={showFeedbackModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Answer Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{feedback}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dashboard;
