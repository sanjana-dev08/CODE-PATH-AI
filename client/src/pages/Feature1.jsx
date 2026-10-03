import { useEffect, useState } from "react";
import { Award, CalendarDays, Check, ChevronRight, UserRound } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

function Feature1() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/progress").then(({ data }) => setStats(data.data.stats)).catch(() => setStats({ attempted: 0, completed: 0, currentStreak: 0 })); }, []);
  const milestones = [
    ["First question asked", true],
    ["First practice attempt", stats?.attempted > 0],
    ["First problem completed", stats?.completed > 0],
    ["3-day practice streak", stats?.currentStreak >= 3],
  ];

  return (
    <><Navbar /><main className="app-main"><section className="page-heading"><p className="eyebrow">FEATURE 01 · USER MANAGEMENT</p><h1>Your learner profile</h1><p className="muted">A record of the effort you are putting into understanding code.</p></section>
      <div className="feature-grid two-one"><Card className="profile-card"><div className="profile-hero"><span className="profile-avatar"><UserRound size={27} /></span><div><h2>{user?.name || "Sanjana Reddy"}</h2><p>{user?.email}</p></div></div><div className="profile-fields"><div><span>Learning goal</span><strong>Become a confident programmer</strong></div><div><span>Learning style</span><strong>Understand the why, then practice</strong></div><div><span>Joined</span><strong><CalendarDays size={15} /> Learning at your pace</strong></div></div></Card>
        <Card><p className="eyebrow">MILESTONES</p><h2>Your firsts matter</h2><div className="milestone-list">{milestones.map(([title, done], index) => <div className="milestone-row" key={title}><span className={done ? "milestone-check done" : "milestone-check"}>{done ? <Check size={15} /> : index + 1}</span><span>{title}</span>{done && <span className="milestone-earned">Earned</span>}</div>)}</div></Card>
      </div>
      <Card className="before-now"><div className="panel-heading"><div><p className="eyebrow">BEFORE VS NOW</p><h2>Growth is more than a score</h2></div><span className="award-mark"><Award size={21} /></span></div><div className="reflection-columns"><div><span className="reflection-tag">BEFORE</span><p>“I don't know where to start.”</p><small>Every problem feels like a blank page.</small></div><ChevronRight className="reflection-arrow" size={24} /><div><span className="reflection-tag now-tag">NOW</span><p>“I can break it into smaller steps.”</p><small>Practice gives you a path forward.</small></div></div></Card>
    </main></>
  );
}

export default Feature1;