import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReplayIcon from "@mui/icons-material/Replay";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const questions = [
    {
        id: 1,
        text: "I have felt cheerful and in good spirits",
    },
    {
        id: 2,
        text: "I have felt calm and relaxed",
    },
    {
        id: 3,
        text: "I have felt active and vigorous",
    },
    {
        id: 4,
        text: "I woke up feeling fresh and rested",
    },
    {
        id: 5,
        text: "My daily life has been filled with things that interest me",
    },
];
const options = [
    { value: 5, label: "All of the time" },
    { value: 4, label: "Most of the time" },
    { value: 3, label: "More than half the time" },
    { value: 2, label: "Less than half the time" },
    { value: 1, label: "Some of the time" },
    { value: 0, label: "At no time" }
];

function getFeedback(score) {
    if (score >= 35) return "Excellent well-being! Keep up the great work maintaining your mental health.";
    if (score >= 25) return "Good well-being. You're doing well, but there's always room for self-care!";
    if (score >= 15) return "Moderate well-being. Consider taking steps to improve your mood and energy.";
    return "Low well-being. It might help to talk to someone you trust or a mental health professional.";
}

function Questionnaire() {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Add more engaging questions
    const extendedQuestions = [
        ...questions,
        {
            id: 6,
            text: "I have felt connected to people around me",
        },
        {
            id: 7,
            text: "I have enjoyed learning or trying something new",
        },
        {
            id: 8,
            text: "I have felt proud of something I accomplished",
        }
    ];

    // Gamification: badges for high scores
    function getBadge(score) {
        if (score >= 35) {
            return { label: "Well-being Champion", color: "success", icon: <EmojiEventsIcon /> };
        }
        if (score >= 25) {
            return { label: "Well-being Star", color: "primary", icon: <EmojiEventsIcon /> };
        }
        return null;
    }

    // Progress bar color
    function getProgressColor(score, max) {
        if (score / max > 0.7) return "success";
        if (score / max > 0.4) return "primary";
        return "warning";
    }

    // Stepper for question navigation
    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleNext = () => {
        if (activeStep < extendedQuestions.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const handleRadioChange = (qid, value) => {
        setAnswers((prev) => ({ ...prev, [qid]: value }));
        if (activeStep < extendedQuestions.length - 1) {
            setTimeout(handleNext, 350); // auto-advance with slight delay
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setShowSnackbar(true);
    };

    const totalScore = Object.values(answers).reduce((a, b) => a + Number(b), 0);
    const maxScore = extendedQuestions.length * 5;
    const badge = getBadge(totalScore);

    // Gamification: streaks, confetti, and motivational quotes
    const [streak, setStreak] = useState(() => {
        const s = Number(localStorage.getItem("mh_streak") || 0);
        return s;
    });
    const [showConfetti, setShowConfetti] = useState(false);
    const motivationalQuotes = [
        "Small steps every day lead to big changes.",
        "Your well-being matters. Keep going!",
        "Celebrate progress, not perfection.",
        "You are stronger than you think.",
        "Every day is a fresh start."
    ];
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    // Confetti effect (simple emoji burst)
    function ConfettiBurst() {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: 2000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 60,
                    animation: "fadeOut 2s forwards"
                }}
            >
                <span role="img" aria-label="confetti">🎉🎊✨</span>
                <style>
                    {`
                        @keyframes fadeOut {
                            0% { opacity: 1; }
                            100% { opacity: 0; }
                        }
                    `}
                </style>
            </Box>
        );
    }

    // Handle streak and confetti on submit
    const handleGamifiedSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setShowSnackbar(true);
        // Streak logic: increment if submitted today, else reset
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem("mh_last_date");
        let newStreak = streak;
        if (lastDate !== today) {
            newStreak = lastDate ? streak + 1 : 1;
            setStreak(newStreak);
            localStorage.setItem("mh_streak", newStreak);
            localStorage.setItem("mh_last_date", today);
        }
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1800);
    };

    return (
        <Box sx={{
            maxWidth: 520,
            mx: "auto",
            mt: 5,
        }}>
            <Typography align="center" color="text.secondary" mb={2}>
                <Chip
                    avatar={<Avatar>🕹️</Avatar>}
                    label="Well-Being Adventure"
                    color="secondary"
                    variant="filled"
                    sx={{ fontWeight: 700, fontSize: 18, letterSpacing: 1 }}
                />
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <Chip
                    avatar={<Avatar>🔥</Avatar>}
                    label={`Streak: ${streak} day${streak === 1 ? "" : "s"}`}
                    color={streak >= 3 ? "success" : "warning"}
                    sx={{ fontWeight: 600, mr: 1 }}
                />
                <Tooltip title="Answer all questions to earn a trophy!">
                    <Chip
                        avatar={<Avatar><EmojiEventsIcon color="warning" /></Avatar>}
                        label="Trophy Hunt"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                </Tooltip>
            </Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {extendedQuestions.map((q, idx) => (
                    <Step key={q.id}>
                        <StepLabel>{idx + 1}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <LinearProgress
                variant="determinate"
                value={Object.keys(answers).length / extendedQuestions.length * 100}
                color={getProgressColor(Object.keys(answers).length, extendedQuestions.length)}
                sx={{ mb: 3, height: 10, borderRadius: 5 }}
            />
            {!submitted ? (
                <form onSubmit={handleGamifiedSubmit}>
                    <Card variant="outlined" sx={{
                        mb: 2,
                        bgcolor: "#f5fafd",
                        borderRadius: 3,
                        boxShadow: 2,
                        transition: "box-shadow 0.2s"
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Tooltip title="Need help understanding this question?">
                                    <HelpOutlineIcon color="primary" sx={{ mr: 1 }} />
                                </Tooltip>
                                <Typography variant="h6" fontWeight={600}>
                                    {extendedQuestions[activeStep].text}
                                </Typography>
                            </Box>
                            <RadioGroup
                                value={answers[extendedQuestions[activeStep].id] ?? ""}
                                onChange={(_, value) => handleRadioChange(extendedQuestions[activeStep].id, Number(value))}
                            >
                                {options.map((opt) => (
                                    <FormControlLabel
                                        key={opt.value}
                                        value={opt.value}
                                        control={<Radio color="primary" />}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="body1" fontWeight={500}>{opt.label}</Typography>
                                                {answers[extendedQuestions[activeStep].id] === opt.value && (
                                                    <Chip label="Selected" size="small" color="success" sx={{ ml: 1 }} />
                                                )}
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: answers[extendedQuestions[activeStep].id] === opt.value ? "#e3f2fd" : "inherit",
                                            borderRadius: 2,
                                            px: 1,
                                            my: 0.5
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>
                        {activeStep < extendedQuestions.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={answers[extendedQuestions[activeStep].id] == null}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={Object.keys(answers).length !== extendedQuestions.length}
                            >
                                Unlock My Score!
                            </Button>
                        )}
                    </Box>
                    <Typography align="center" color="text.secondary" fontSize={14}>
                        Question {activeStep + 1} of {extendedQuestions.length}
                    </Typography>
                    <Box mt={2} textAlign="center">
                        <Typography variant="caption" color="info.main" fontStyle="italic">
                            {randomQuote}
                        </Typography>
                    </Box>
                </form>
            ) : (
                <Box textAlign="center" mt={3}>
                    {showConfetti && <ConfettiBurst />}
                    <Card sx={{
                        bgcolor: "#e8f5e9",
                        borderRadius: 3,
                        boxShadow: 3,
                        mb: 2
                    }}>
                        <CardContent>
                            <Typography variant="h5" fontWeight={700} color="success.main" mb={1}>
                                🎉 Adventure Complete! 🎉
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="primary" mb={1}>
                                Your Well-Being Score: <span style={{ fontSize: 32 }}>{totalScore}</span> / {maxScore}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={totalScore / maxScore * 100}
                                color={getProgressColor(totalScore, maxScore)}
                                sx={{ height: 10, borderRadius: 5, mb: 2 }}
                            />
                            <Typography variant="body1" mb={2}>
                                {getFeedback(totalScore)}
                            </Typography>
                            {badge && (
                                <Chip
                                    icon={badge.icon}
                                    label={badge.label}
                                    color={badge.color}
                                    sx={{ fontWeight: 600, fontSize: 16, mb: 2 }}
                                />
                            )}
                            {Object.keys(answers).length === extendedQuestions.length && (
                                <Box mt={1}>
                                    <Chip
                                        icon={<EmojiEventsIcon />}
                                        label="Trophy Unlocked: Completed All Questions!"
                                        color="secondary"
                                        sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}
                                    />
                                </Box>
                            )}
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ReplayIcon />}
                                    onClick={() => {
                                        setAnswers({});
                                        setSubmitted(false);
                                        setActiveStep(0);
                                    }}
                                >
                                    Play Again
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Want to improve your score? Try a new hobby, connect with friends, or take a mindful walk!
                    </Typography>
                    <Typography variant="caption" color="info.main" fontStyle="italic">
                        {randomQuote}
                    </Typography>
                </Box>
            )}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Adventure submitted! See your results below.
                </Alert>
            </Snackbar>
        </Box>
    );
}
export default Questionnaire;
