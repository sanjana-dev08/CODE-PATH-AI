import { useEffect, useState } from "react";
import { ArrowRight, Award, BookOpenCheck, Check, ChevronRight, CircleHelp, Code2, Flame, Gauge, Lightbulb, ListChecks, Play, RotateCcw, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { WeeklyChart } from "../components/Charts";
import Loader from "../components/Loader";
import { useAuth } from "../context/useAuth";
import api, { getErrorMessage } from "../services/api";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizState, setQuizState] = useState("idle");
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizRemaining, setQuizRemaining] = useState(null);
  const [quizBusy, setQuizBusy] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [error, setError] = useState("");
  const quiz = quizQuestions[quizIndex];

  useEffect(() => { api.get("/progress").then(({ data: response }) => setData(response.data)).catch((requestError) => setError(getErrorMessage(requestError))); }, []);

  const startQuiz = async () => {
    setQuizBusy(true);
    setQuizError("");
    try {
      const { data: response } = await api.post("/progress/quiz/start");
      setQuizQuestions(response.data.questions);
      setQuizRemaining(response.data.remainingQuestions);
      setQuizIndex(0);
      setQuizAnswer("");
      setQuizScore(0);
      setQuizFeedback(null);
      setQuizState("active");
    } catch (requestError) {
      setQuizError(getErrorMessage(requestError));
    } finally {
      setQuizBusy(false);
    }
  };

  const submitQuiz = async () => {
    if (!quizAnswer || quizState !== "active" || !quiz) return;
    setQuizBusy(true);
    setQuizError("");
    try {
      const { data: result } = await api.post("/progress/quiz", { questionId: quiz.id, answer: quizAnswer });
      setQuizFeedback(result.data);
      if (result.data.correct) setQuizScore((score) => score + 1);
      setQuizState("answered");
      const { data: response } = await api.get("/progress");
      setData(response.data);
    } catch (requestError) {
      setQuizError(getErrorMessage(requestError));
    } finally {
      setQuizBusy(false);
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizState("finished");
      return;
    }
    setQuizIndex((index) => index + 1);
    setQuizAnswer("");
    setQuizFeedback(null);
    setQuizState("active");
  };

  if (!data && !error) return <Loader label="Loading your learning space" />;
  const stats = data?.stats || { attempted: 0, completed: 0, submissions: 0, successRate: 0, currentStreak: 0, todayProgress: 0 };
  const stages = ["Understand", "Concept", "Logic", "Flowchart", "Pseudocode", "Code", "Debug", "Mastered"];

  return (
    <><Navbar /><main className="app-main">
      <section className="welcome-row"><div><p className="eyebrow">YOUR LEARNING SPACE <span className="live-dot" /></p><h1>Welcome, {user?.name || "Sanjana Reddy"}</h1><p className="muted">Small steps count. Pick up where your curiosity takes you.</p></div><Link className="button button-dark" to="/feature3"><Lightbulb size={17} /> Ask the tutor <ArrowRight size={16} /></Link></section>
      {error && <p className="form-error">{error}</p>}
      <section className="metric-grid">
        {[["Problems Attempted", stats.attempted, ListChecks, "teal"], ["Problems Completed", stats.completed, BookOpenCheck, "gold"], ["Submissions", stats.submissions, Code2, "coral"], ["Success Rate", `${stats.successRate}%`, Target, "ink"], ["Current Streak", `${stats.currentStreak} days`, Flame, "gold"], ["Today's Progress", stats.todayProgress, Gauge, "teal"]].map(([label, value, Icon, color]) => <Card className="metric-card" key={label}><span className={`metric-icon ${color}`}><Icon size={19} /></span><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-caption">{label === "Success Rate" ? "completed submissions" : label === "Current Streak" ? "days with practice" : "in your learning log"}</span></Card>)}
      </section>
      <section className="dashboard-columns">
        <Card className="journey-panel"><div className="panel-heading"><div><p className="eyebrow">THE THINKING-TO-CODE PATH</p><h2>Coding Journey</h2></div><span className="step-count">{stages.length} steps</span></div><div className="journey-steps">{stages.map((stage, index) => <div className="journey-step" key={stage}><span className={index < (stats.completed ? 6 : 0) ? "journey-number done" : "journey-number"}>{index < (stats.completed ? 6 : 0) ? <Check size={14} /> : `0${index + 1}`}</span><span>{stage}</span>{index < stages.length - 1 && <i />}</div>)}</div><p className="journey-note">Understand → Concept → Logic → Flowchart → Pseudocode → Code → Debug → Mastered</p></Card>
        <Card className="chart-panel"><div className="panel-heading"><div><p className="eyebrow">SHOWING UP ADDS UP</p><h2>7-day progress</h2></div><span className="chart-legend"><i /> Tried <i className="legend-gold" /> Completed</span></div><WeeklyChart data={data?.sevenDayProgress} /></Card>
      </section>
      <section className="dashboard-columns lower-columns">
        <Card className="quiz-card"><div className="quiz-topline"><span className="metric-icon coral"><CircleHelp size={19} /></span><span className="quiz-kicker">{quizState === "idle" ? "FRESH QUESTIONS · MIXED TOPICS" : quizState === "finished" ? "QUIZ COMPLETE" : `QUESTION ${quizIndex + 1} OF ${quizQuestions.length} · ${quiz?.kind.toUpperCase()}`}</span>{quiz && <span className="quiz-topic">{quiz.topic}</span>}</div>
          {quizState === "idle" && <><h2>Ready for 10 fresh questions?</h2><p className="quiz-question">Take a shuffled quiz whenever you like. Questions you have already received won’t appear in another quiz.</p>{quizRemaining !== null && <p className="quiz-pool-note">{quizRemaining} new {quizRemaining === 1 ? "question" : "questions"} left in your pool.</p>}<button className="button button-primary" onClick={startQuiz} disabled={quizBusy}>{quizBusy ? "Preparing your quiz..." : <>Start quiz <Play size={15} /></>}</button></>}
          {(quizState === "active" || quizState === "answered") && quiz && <><div className="quiz-session-progress"><span>Question {quizIndex + 1} of {quizQuestions.length}</span><progress value={quizIndex + (quizState === "answered" ? 1 : 0)} max={quizQuestions.length} /></div><h2>{quiz.question}</h2><div className="quiz-options">{quiz.options.map((option) => <button disabled={quizState !== "active" || quizBusy} onClick={() => setQuizAnswer(option)} key={option} className={quizAnswer === option ? "quiz-option selected" : "quiz-option"}>{option}</button>)}</div>{quizState === "active" ? <button className="button button-primary" onClick={submitQuiz} disabled={!quizAnswer || quizBusy}>{quizBusy ? "Checking..." : <>Check answer <ArrowRight size={16} /></>}</button> : <><div className={quizFeedback?.correct ? "quiz-feedback good" : "quiz-feedback"}><b>{quizFeedback?.correct ? "Correct." : `Not quite. The answer is ${quizFeedback?.correctAnswer}.`}</b> {quizFeedback?.explanation}</div><button className="button button-primary quiz-next" onClick={nextQuizQuestion}>{quizIndex + 1 === quizQuestions.length ? "See my score" : "Next question"} <ChevronRight size={16} /></button></>}</>}
          {quizState === "finished" && <div className="quiz-finish"><span className="metric-icon gold"><Trophy size={20} /></span><h2>You finished this quiz.</h2><p className="quiz-score">{quizScore} <span>out of {quizQuestions.length} correct</span></p><p className="quiz-question">Your answers have been saved. Start another quiz whenever you’re ready for a fresh set.</p><button className="button button-primary" onClick={startQuiz} disabled={quizBusy}><RotateCcw size={15} /> Start another quiz</button></div>}
          {quizError && <p className="form-error quiz-error" role="alert">{quizError}</p>}
        </Card>
        <Card className="quickstart-card"><p className="eyebrow">CHOOSE YOUR NEXT MOVE</p><h2>What would help right now?</h2><Link to="/feature2" className="action-row"><span className="action-icon"><CircleHelp size={18} /></span><span><b>I don't know where to start</b><small>Break a problem into its first steps</small></span><ArrowRight size={17} /></Link><Link to="/feature4" className="action-row"><span className="action-icon action-gold"><Code2 size={18} /></span><span><b>Practice a problem</b><small>Build confidence through repetition</small></span><ArrowRight size={17} /></Link><Link to="/feature5" className="action-row"><span className="action-icon action-coral"><Award size={18} /></span><span><b>See my progress</b><small>Find a skill to strengthen next</small></span><ArrowRight size={17} /></Link></Card>
      </section>
    </main></>
  );
}

export default Dashboard;