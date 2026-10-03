import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, Check, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../services/api";

function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate("/dashboard", { replace: true }); }, [loading, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <aside className="auth-story">
        <div className="auth-wordmark"><span className="brand-mark"><BrainCircuit size={20} /></span> codepath<span className="brand-dot">.</span></div>
        <div className="story-copy"><p className="eyebrow">THINKING, MADE VISIBLE</p><h1>Understand first.<br /><em>Code with confidence.</em></h1><p>Guiding beginners from understanding problems to confidently writing code.</p></div>
        <div className="story-path"><span>01 Understand</span><i /><span>02 Find the logic</span><i /><span>03 Write the code</span></div>
        <div className="story-note"><Check size={16} /> A calmer way to learn programming</div>
      </aside>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <p className="eyebrow">YOUR NEXT STEP STARTS HERE</p>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue your coding journey.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field-label">Email address<span className="input-wrap"><Mail size={17} /><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></span></label>
            <label className="field-label">Password<span className="input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /></span></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary button-wide" disabled={busy}>{busy ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">New to CodePath AI? <Link to="/register">Create an account</Link></p>
        </div>
        <span className="auth-footer">Learn the path, not just the answer.</span>
      </section>
    </main>
  );
}

export default Login;