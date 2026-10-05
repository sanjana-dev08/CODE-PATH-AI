import { useState } from "react";
import { ArrowDown, ArrowRight, Check, CircleHelp, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { askTutor } from "../services/aiService";
import { getErrorMessage } from "../services/api";

const logicSteps = ["Compare this value with the best so far", "Start with the first item", "Return the best value after checking all items", "Move through each remaining item"];
const languages = ["JavaScript", "Python", "Java", "C", "C++", "SQL"];
const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem("codepath-language");
  return languages.includes(savedLanguage) ? savedLanguage : "JavaScript";
};

function Feature2() {
  const [problem, setProblem] = useState("Find the largest number in an array");
  const [language, setLanguage] = useState(getSavedLanguage);
  const [started, setStarted] = useState(false);
  const [ordered, setOrdered] = useState([]);
  const [complete, setComplete] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solutionBusy, setSolutionBusy] = useState(false);
  const [solutionError, setSolutionError] = useState("");

  const generateSolution = async (targetLanguage = language) => {
    setSolutionBusy(true);
    setSolutionError("");
    try {
      setSolution(await askTutor(problem, { mode: "Code", language: targetLanguage }));
    } catch (error) {
      setSolutionError(getErrorMessage(error));
    } finally {
      setSolutionBusy(false);
    }
  };

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("codepath-language", nextLanguage);
    if (solution) generateSolution(nextLanguage);
  };

  const placeStep = (step) => {
    if (ordered.includes(step)) return;
    const next = [...ordered, step];
    setOrdered(next);
    setComplete(next.length === logicSteps.length && next.join("|") === [logicSteps[1], logicSteps[3], logicSteps[0], logicSteps[2]].join("|"));
  };

  return (
    <><Navbar /><main className="app-main"><section className="page-heading"><p className="eyebrow">FEATURE 02 · PROBLEM UNDERSTANDING</p><h1>Start with the thinking</h1><p className="muted">A problem gets easier when you make the next step small enough.</p></section>
      <Card className="start-card"><div className="start-copy"><span className="metric-icon coral"><CircleHelp size={20} /></span><p className="eyebrow">I DON'T KNOW WHERE TO START</p><h2>Tell me what you're trying to solve.</h2><p>We'll begin by making sense of the goal, not by jumping into syntax.</p></div><div className="start-input"><label className="field-label" htmlFor="problem-prompt">Problem or question</label><textarea id="problem-prompt" value={problem} onChange={(event) => { setProblem(event.target.value); setSolution(null); }} placeholder="Describe your coding problem in your own words" /><label className="field-label" htmlFor="feature2-language">Preferred language</label><select id="feature2-language" value={language} onChange={(event) => changeLanguage(event.target.value)}>{languages.map((item) => <option key={item} value={item}>{item}</option>)}</select><button className="button button-primary" onClick={() => setStarted(true)} disabled={!problem.trim()}>Find my first step <ArrowRight size={16} /></button><button className="button button-secondary" onClick={generateSolution} disabled={!problem.trim() || solutionBusy}>{solutionBusy ? "Generating..." : "Generate Code"}</button>{solutionError && <p className="form-error">{solutionError}</p>}</div></Card>
      {started && <div className="feature-grid three-cards"><Card><span className="step-pill">01 · RESTATE</span><h3>What is the goal?</h3><p className="muted">{problem.trim()}.</p><small>Say what the answer should look like.</small></Card><Card><span className="step-pill gold-pill">02 · INPUT</span><h3>What do you have?</h3><p className="muted">Identify the values, their shape, and whether there are edge cases.</p><small>Example: an array of numbers, possibly empty.</small></Card><Card><span className="step-pill coral-pill">03 · FIRST MOVE</span><h3>Try one tiny case</h3><p className="muted">Walk through a small input by hand before choosing code.</p><small>Example: [3, 8, 2] should produce 8.</small></Card></div>}
      {solution && <Card className="feature2-solution"><div className="panel-heading"><div><p className="eyebrow">SOLUTION · {solution.language}</p><h2>{solution.question}</h2></div></div><pre className="code-block"><code>{solution.steps?.find((step) => step.title === "Code")?.body}</code></pre></Card>}
      <Card className="logic-builder"><div className="panel-heading"><div><p className="eyebrow">LOGIC BUILDER</p><h2>Put the steps in a useful order</h2></div><button className="icon-button" aria-label="Reset logic order" onClick={() => { setOrdered([]); setComplete(false); }}><RotateCcw size={17} /></button></div><p className="muted">Choose the steps one at a time. The goal is to find and keep a running maximum.</p><div className="logic-board"><div className="logic-choices">{logicSteps.filter((step) => !ordered.includes(step)).map((step) => <button className="logic-choice" key={step} onClick={() => placeStep(step)}>{step}<ArrowDown size={15} /></button>)}</div><div className="logic-answer">{ordered.length ? ordered.map((step, index) => <div className="logic-answer-step" key={step}><span>{index + 1}</span>{step}</div>) : <div className="logic-empty">Your ordered steps will appear here</div>}{complete && <p className="success-line"><Check size={16} /> Nice sequencing. You have a plan to turn into pseudocode.</p>}</div></div></Card>
    </main></>
  );
}

export default Feature2;