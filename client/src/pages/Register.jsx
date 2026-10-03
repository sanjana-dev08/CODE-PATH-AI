import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate("/dashboard", { replace: true }); }, [loading, user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please complete all fields.");
      return;
    }

    try {
      setBusy(true);
      setMessage("");
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });

    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <aside className="auth-story"><div className="auth-wordmark"><span className="brand-mark"><BrainCircuit size={20} /></span> codepath<span className="brand-dot">.</span></div><div className="story-copy"><p className="eyebrow">A BETTER WAY TO BEGIN</p><h1>Small steps.<br /><em>Real understanding.</em></h1><p>Build a strong foundation by learning how a solution comes together.</p></div><div className="story-path"><span>01 Ask questions</span><i /><span>02 Practice thinking</span><i /><span>03 Grow your skill</span></div><div className="story-note">Your learning progress stays yours.</div></aside>
      <section className="auth-form-side"><div className="auth-form-wrap"><p className="eyebrow">START YOUR CODING JOURNEY</p><h2>Create your account</h2><p className="muted">One thoughtful step at a time.</p>
        <form onSubmit={handleRegister} className="form-stack">
          <label className="field-label">Full name<span className="input-wrap"><UserRound size={17} /><input type="text" autoComplete="name" placeholder="Sanjana Reddy" value={name} onChange={(event) => setName(event.target.value)} required /></span></label>
          <label className="field-label">Email address<span className="input-wrap"><Mail size={17} /><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></span></label>
          <label className="field-label">Password<span className="input-wrap"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></span></label>
          {message && <p className="form-error" role="alert">{message}</p>}
          <button type="submit" disabled={busy} className="button button-primary button-wide">{busy ? "Creating account..." : <>Create account <ArrowRight size={17} /></>}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div><span className="auth-footer">Learn the path, not just the answer.</span></section>
    </main>
  );
}

export default Register;