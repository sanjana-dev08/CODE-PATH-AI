import { useState } from "react";
import { BrainCircuit, Check, Copy, Lightbulb, MessageCircle, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Loader from "../components/Loader";
import { askTutor } from "../services/aiService";
import { getErrorMessage } from "../services/api";

const modeLabels = ["Explain", "Hint", "Pseudocode", "Flowchart", "Code", "Line by Line", "Debug", "Practice", "I'm Stuck"];
const alternativeActions = ["Try Another Way", "Make It Simpler", "Show Different Approaches"];
const languages = ["JavaScript", "Python", "Java", "C", "C++", "SQL"];
const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem("codepath-language");
  return languages.includes(savedLanguage) ? savedLanguage : "JavaScript";
};

function Feature3() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Explain");
  const [selectedLanguage, setSelectedLanguage] = useState(getSavedLanguage);
  const [conversation, setConversation] = useState([]);

  const sendQuestion = async (nextQuestion, forceMode = selectedMode, targetLanguage = selectedLanguage) => {
    const cleaned = nextQuestion.trim();
    if (!cleaned) return;

    setBusy(true);
    setError("");

    try {
      const userMessage = { role: "user", content: cleaned };
      const history = [...conversation, userMessage];
      const response = await askTutor(cleaned, {
        mode: forceMode,
        language: targetLanguage,
        conversation: history,
        previousCode: answer?.steps?.find((step) => step.title === "Code")?.body || ""
      });

      const assistantMessage = {
        role: "assistant",
        content: cleaned,
        answer: response
      };

      setConversation((prev) => [...prev, userMessage, assistantMessage]);
      setAnswer(response);
      setQuestion("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const handleAsk = async (event) => {
    event.preventDefault();
    await sendQuestion(question, selectedMode);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem("codepath-language", language);
    if (!answer?.question) return;

    const priorMode = answer.tutorMode || answer.mode;
    const responseMode = priorMode === "Try Another Way" || priorMode === "try-another-way"
      ? "Try Another Way"
      : priorMode === "Make It Simpler" || priorMode === "make-it-simpler"
        ? "Make It Simpler"
        : priorMode === "Show Different Approaches" || priorMode === "show-different-approaches"
          ? "Show Different Approaches"
          : selectedMode;
    sendQuestion(answer.question, responseMode, language);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      setError("Copy failed. Please select the code and copy it manually.");
    }
  };

  const renderAssistantResponse = (message) => {
    const response = message.answer;
    if (!response) return null;

    return (
      <div className="chat-response">
        <div className="chat-response-meta">
          <span className="chat-badge">{response.mode === "ai" ? "AI" : "Guide"}</span>
          <span className="chat-language">{response.language || selectedLanguage}</span>
        </div>

        <h3>{response.question || message.content}</h3>

        {response.steps?.map((step, index) => (
          <div key={`${step.title}-${index}`} className="chat-response-step">
            <span className="step-pill">{index + 1} · {step.title.toUpperCase()}</span>

            {step.title === "Code" ? (
              <>
                <pre className="code-block">
                  <code>{step.body}</code>
                </pre>
                <button type="button" className="copy-code" onClick={() => copyCode(step.body)}>
                  <Copy size={14} /> Copy Code
                </button>
              </>
            ) : (
              <p>{step.body}</p>
            )}
          </div>
        ))}

        {response.approaches?.length > 0 && (
          <div className="chat-approaches-box">
            <b>Different approaches</b>
            {(response.approaches || []).map((item) => (
              <div key={item.name} className="chat-approach-item">
                <span>{item.name}</span>
                <small>{item.difficulty} · {item.complexity}</small>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="chat-footer-panel">
          <div className="chat-why">
            <Lightbulb size={16} />
            <div>
              <b>Why this matters</b>
              <p>{response.why}</p>
            </div>
          </div>

          <div className="chat-memory-hook">
            <b>Remember</b>
            <span>{response.memoryHook}</span>
          </div>

          <div className="chat-hints">
            <div>
              <b>Hints</b>
              {(response.hints || []).map((hint) => <p key={hint}>• {hint}</p>)}
            </div>
            <div>
              <b>Try asking yourself</b>
              {(response.followUps || []).map((prompt) => <p key={prompt}>• {prompt}</p>)}
            </div>
          </div>

          <div className="chat-summary">
            <Check size={15} />
            <span>{response.answerText || "The goal is understanding you can reuse on the next problem."}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="app-main">
        <section className="page-heading">
          <p className="eyebrow">FEATURE 03 · AI GUIDANCE</p>
          <h1>AI coding tutor</h1>
          <p className="muted">Don't just get the code. Learn the path to the code.</p>
        </section>

        <Card className="tutor-panel">
          <div className="tutor-header">
            <div className="tutor-orb">
              <BrainCircuit size={22} />
            </div>
            <div className="tutor-header-copy">
              <p className="eyebrow">AI CODING TUTOR</p>
              <h2>AI coding tutor</h2>
            </div>
          </div>

          <div className="tutor-toolbar">
            <div className="tutor-mode-row">
              {modeLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={selectedMode === label ? "chip chip-active" : "chip"}
                  onClick={() => setSelectedMode(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="tutor-language-row">
              <label>
                Preferred language
                <select value={selectedLanguage} onChange={(event) => handleLanguageChange(event.target.value)}>
                  {languages.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="tutor-chat">
            {conversation.length === 0 ? (
              <div className="chat-empty">
                <MessageCircle size={18} />
                <p>Ask anything about programming, debugging, logic, DSA, databases, web development, or code.</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                  {message.role === "user" ? (
                    <div className="chat-bubble user-bubble">{message.content}</div>
                  ) : (
                    <div className="chat-bubble assistant-bubble">{renderAssistantResponse(message)}</div>
                  )}
                </div>
              ))
            )}

            {busy && (
              <div className="chat-message assistant">
                <div className="chat-bubble assistant-bubble loading-bubble">
                  <span className="spinner small-spinner" />
                  Building a step-by-step explanation...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} className="tutor-form">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask any programming question..."
            />
            <div className="tutor-form-bottom">
              <div className="tutor-action-row">
                {alternativeActions.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="chip action-chip"
                    onClick={() => sendQuestion(question.trim() || answer?.question || "", label)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={busy || !question.trim()} className="button button-primary">
                {busy ? "Thinking..." : <>Send <Send size={16} /></>}
              </button>
            </div>
          </form>

          {error && <p className="form-error">{error}</p>}
        </Card>

        {busy && <Loader label="Building a step-by-step explanation" />}
        {!busy && answer && <div className="visually-hidden">{answer.question}</div>}
      </main>
    </>
  );
}

export default Feature3;