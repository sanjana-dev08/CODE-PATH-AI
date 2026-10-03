import { useState } from "react";
import { ArrowRight, BrainCircuit, Code2, Lightbulb, MessageCircle, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { askTutor } from "../services/aiService";
import { getErrorMessage } from "../services/api";

function Feature3() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    setError("");
    try { setAnswer(await askTutor(question)); } catch (requestError) { setError(getErrorMessage(requestError)); } finally { setBusy(false); }
  };

  return (
    <><Navbar /><main className="app-main"><section className="page-heading"><p className="eyebrow">FEATURE 03 · AI GUIDANCE</p><h1>AI coding tutor</h1><p className="muted">Don't just get the code. Learn the path to the code.</p></section>
      <Card className="tutor-prompt"><div className="tutor-orb"><BrainCircuit size={24} /></div><div className="tutor-intro"><p className="eyebrow">YOUR QUESTION, YOUR PACE</p><h2>What are you trying to figure out?</h2><p>Ask any coding question. You can also paste a code snippet and ask what it does.</p></div><form onSubmit={handleAsk} className="tutor-form"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="I want to find the largest number in an array, but I don't know how to start..." /><div className="tutor-form-bottom"><span>Free-form questions · logic first, code after</span><button type="submit" disabled={busy || !question.trim()} className="button button-primary">{busy ? "Thinking..." : <>Guide me <Send size={16} /></>}</button></div></form>{error && <p className="form-error">{error}</p>}</Card>
      {busy && <Loader label="Building a step-by-step explanation" />}
      {answer && <div className="tutor-answer"><div className="answer-heading"><span className="metric-icon teal"><MessageCircle size={19} /></span><div><p className="eyebrow">{answer.mode === "ai" ? "AI-GUIDED EXPLANATION" : "GUIDED EXPLANATION"}</p><h2>{answer.question}</h2></div></div><div className="tutor-steps">{answer.steps.map((step, index) => <Card className="tutor-step" key={step.title}><span className="step-pill">0{index + 1} · {step.title.toUpperCase()}</span>{step.title === "Code" ? <pre className="code-block"><code>{step.body}</code></pre> : <p>{step.body}</p>}{step.title === "Code" && <div className="line-notes"><b>Line by line</b>{answer.lineByLine?.length ? answer.lineByLine.map((note, lineIndex) => <div key={`${lineIndex}-${note.code}`}><code>{note.code}</code><span>{note.explanation}</span></div>) : <p>Add one sample input and expected output so the tutor can choose and explain the right code.</p>}</div>}</Card>)}</div><Card className="why-card"><div><Lightbulb size={18} /><h3>Why these parts matter</h3></div><p>{answer.why}</p><div className="memory-hook"><b>Remember the approach</b><span>{answer.memoryHook}</span></div><div className="hint-followups"><div><b>Hints</b>{answer.hints.map((hint) => <p key={hint}>• {hint}</p>)}</div><div><b>Try asking yourself</b>{answer.followUps.map((prompt) => <p key={prompt}>• {prompt}</p>)}</div></div><div className="tutor-end"><Code2 size={17} /> The goal is understanding you can reuse on the next problem. <ArrowRight size={16} /></div></Card></div>}
    </main></>
  );
}

export default Feature3;