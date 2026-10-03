import { NavLink, useNavigate } from "react-router-dom";
import { Activity, BrainCircuit, Code2, Compass, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const links = [
  ["/dashboard", "Home", Compass],
  ["/feature1", "Profile", UserRound],
  ["/feature2", "Understand", BrainCircuit],
  ["/feature3", "AI tutor", Activity],
  ["/feature4", "Practice", Code2],
  ["/feature5", "Progress", Activity],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const signOut = () => { logout(); navigate("/login", { replace: true }); };
  return <header className="topbar">
    <NavLink className="brand" to="/dashboard"><span className="brand-mark"><BrainCircuit size={20} /></span><span>codepath<span className="brand-dot">.</span><small>AI learning studio</small></span></NavLink>
    <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    <nav className={open ? "nav-links nav-open" : "nav-links"}>
      {links.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Icon size={16} /><span>{label}</span></NavLink>)}
    </nav>
    <div className="account-menu"><span className="avatar">{(user?.name || "S").slice(0, 1).toUpperCase()}</span><span className="account-name">{user?.name || "Learner"}</span><button className="icon-button" onClick={signOut} aria-label="Log out" title="Log out"><LogOut size={17} /></button></div>
  </header>;
}