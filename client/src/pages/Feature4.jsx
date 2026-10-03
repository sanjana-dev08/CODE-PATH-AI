import { useEffect, useState } from "react";
import { ArrowRight, Bug, Check, Code2, Eye, Lightbulb, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loader from "../components/Loader";
import api, { getErrorMessage } from "../services/api";

const practiceSteps = ["Understand Problem", "Build Logic", "Hint", "Write Code", "Submit", "Analysis", "Try Again"];

function Feature4() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("Basic");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState(0);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [debugAnswer, setDebugAnswer] = useState("");
  const [debugResult, setDebugResult] = useState("");
  const [prediction, setPrediction] = useState("");
  const [predictionResult, setPredictionResult] = useState("");

  useEffect(() => { api.get("/problems").then(({ data }) => { setProblems(data.data.problems); setProblem(data.data.problems.find((item) => item.difficulty === "Basic")); }).catch((requestError) => setError(getErrorMessage(requestError))).finally(() => setLoading(false)); }, []);
  const shownProblems = problems.filter((item) => item.difficulty === difficulty);

  const chooseDifficulty = (level) => { setDifficulty(level); setProblem(problems.find((item) => item.difficulty === level) || null); setPhase(0); setSubmission(null); setCode(""); };
  const chooseProblem = (selected) => { setProblem(selected); setPhase(0); setSubmission(null); setCode(""); };
  const submit = async () => {
    if (!problem || !code.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/submissions", { problemId: problem._id, problemTitle: problem.title, code, language: "javascript" });
      setSubmission(data.data);
      setPhase(5);
    } catch (requestError) { setError(getErrorMessage(requestError)); } finally { setBusy(false); }
  };
  const markComplete = async () => {
    if (!submission?.submission?._id) return;
    try {
      const { data } = await api.patch(`/submissions/${submission.submission._id}/complete`);
      setSubmission((current) => ({ ...current, submission: data.data.submission }));
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  };

  return (
    <><Navbar /><main className="app-main"><section className="page-heading"><p className="eyebrow">FEATURE 04 · CODE PRACTICE & ANALYSIS</p><h1>Practice the path</h1><p className="muted">Understand, plan, write, and review. Your code is saved for reflection, not executed on the server.</p></section>
      <div className="practice-layout"><aside className="practice-sidebar"><div className="level-tabs" role="tablist" aria-label="Difficulty"><button className={difficulty === "Basic" ? "level-tab active" : "level-tab"} onClick={() => chooseDifficulty("Basic")}>Basic</button><button className={difficulty === "Intermediate" ? "level-tab active" : "level-tab"} onClick={() => chooseDifficulty("Intermediate")}>Intermediate</button><button className={difficulty === "Hard" ? "level-tab active" : "level-tab"} onClick={() => chooseDifficulty("Hard")}>Hard</button></div>{loading ? <Loader label="Loading problems" /> : <div className="problem-list">{shownProblems.map((item) => <button className={problem?._id === item._id ? "problem-item active" : "problem-item"} key={item._id} onClick={() => chooseProblem(item)}><span>{item.title}</span><ArrowRight size={15} /></button>)}</div>}</aside>
        <section className="practice-workspace">{problem ? <><div className="practice-title-row"><div><span className={`difficulty-tag ${difficulty.toLowerCase()}`}>{difficulty}</span><h2>{problem.title}</h2></div><span className="language-tag"><Code2 size={14} /> JavaScript</span></div><div className="practice-progress">{practiceSteps.slice(0, 6).map((step, index) => <button key={step} onClick={() => setPhase(index)} className={phase === index ? "practice-stage active" : phase > index ? "practice-stage done" : "practice-stage"}><span>{phase > index ? <Check size={12} /> : index + 1}</span>{step}</button>)}</div>
          <Card className="problem-statement"><p className="eyebrow">UNDERSTAND PROBLEM</p><p>{problem.prompt}</p><div className="example-box"><b>Start with a tiny example</b><span>Write down one input and what you expect the result to be.</span></div></Card>
          <Card className="code-editor-card"><div className="editor-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h3>{phase < 3 ? "Build your approach" : phase === 5 ? "Submission analysis" : "Write your solution"}</h3></div><button className="text-button" onClick={() => { setCode(""); setPhase(0); setSubmission(null); }}><RotateCcw size={15} /> Reset</button></div><div className="logic-prompt"><Lightbulb size={17} /><span>{phase === 0 ? "In one sentence, what should your solution produce?" : phase === 1 ? "What steps could turn that input into the answer?" : phase === 2 ? problem.hint : "Write a solution and trace it against a small example."}</span></div><textarea className="code-editor" aria-label="Write your JavaScript solution" spellCheck="false" value={code} onChange={(event) => { setCode(event.target.value); if (phase < 3) setPhase(3); }} placeholder={`// Write your ${problem.title} solution here\nfunction solve(input) {\n  `} />{error && <p className="form-error">{error}</p>}{submission ? <div className="analysis-box"><b>Analysis</b><p>{submission.analysis}</p><div className="analysis-actions"><span className="status-tag">Saved · not executed</span>{submission.submission.status === "completed" ? <span className="success-line"><Check size={15} /> Marked complete</span> : <button className="button button-secondary" onClick={markComplete}>Mark mastered <Check size={15} /></button>}</div></div> : <div className="editor-actions"><button className="button button-secondary" onClick={() => setPhase(2)}><Lightbulb size={16} /> Show hint</button><button className="button button-primary" onClick={submit} disabled={!code.trim() || busy}>{busy ? "Saving..." : <>Submit for analysis <ArrowRight size={16} /></>}</button></div>}</Card>
        </> : !loading && <Card><p>Choose a practice problem to begin.</p></Card>}</section></div>
      <div className="feature-grid two-cards practice-tools"><Card className="mini-tool"><div className="tool-heading"><span className="metric-icon coral"><Bug size={18} /></span><div><p className="eyebrow">DEBUG DETECTIVE</p><h3>Spot the loop bug</h3></div></div><code className="inline-code">for (let i = 0; i &lt;= items.length; i++)</code><p className="muted">What's the issue with this loop condition?</p><div className="tool-options">{["It skips the first item", "It goes one position past the end", "It runs only once"].map((option) => <button className={debugAnswer === option ? "tool-option selected" : "tool-option"} key={option} onClick={() => { setDebugAnswer(option); setDebugResult(option === "It goes one position past the end" ? "Correct. The last valid index is length - 1, so use i < items.length." : "Try tracing the final loop iteration. Valid indexes end at length - 1."); }}>{option}</button>)}</div>{debugResult && <p className="quiz-feedback">{debugResult}</p>}</Card><Card className="mini-tool"><div className="tool-heading"><span className="metric-icon teal"><Eye size={18} /></span><div><p className="eyebrow">PREDICT THE OUTPUT</p><h3>Trace it before you run it</h3></div></div><code className="inline-code">let n = 1; n *= 3; n += 2;</code><p className="muted">What is the value of n at the end?</p><div className="tool-options compact-options">{["3", "5", "4"].map((option) => <button className={prediction === option ? "tool-option selected" : "tool-option"} key={option} onClick={() => { setPrediction(option); setPredictionResult(option === "5" ? "Yes. First 1 × 3 = 3, then 3 + 2 = 5." : "Not quite. Apply the multiplication first, then add 2."); }}>{option}</button>)}</div>{predictionResult && <p className="quiz-feedback">{predictionResult}</p>}</Card></div>
    </main></>
  );
}

export default Feature4;