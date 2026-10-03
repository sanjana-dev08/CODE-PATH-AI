import { useEffect, useState } from "react";
import { Activity, ArrowRight, Award, Flame, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { TopicChart, WeeklyChart } from "../components/Charts";
import Loader from "../components/Loader";
import api, { getErrorMessage } from "../services/api";

function Feature5() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/progress").then(({ data: response }) => setData(response.data)).catch((requestError) => setError(getErrorMessage(requestError))); }, []);
  if (!data && !error) return <Loader label="Gathering your learning progress" />;
  const stats = data?.stats || {};
  const topicData = data?.topicPerformance || [];
  const weakest = topicData.filter((topic) => topic.attempts).sort((first, second) => first.score - second.score)[0];

  return (
    <><Navbar /><main className="app-main"><section className="page-heading"><p className="eyebrow">FEATURE 05 · PROGRESS TRACKING</p><h1>Your progress, in perspective</h1><p className="muted">Notice what is getting easier and find one useful next step.</p></section>{error && <p className="form-error">{error}</p>}
      <section className="progress-summary"><Card><span className="metric-icon teal"><Activity size={19} /></span><span className="metric-label">Problems attempted</span><strong className="metric-value">{stats.attempted || 0}</strong></Card><Card><span className="metric-icon gold"><Award size={19} /></span><span className="metric-label">Problems completed</span><strong className="metric-value">{stats.completed || 0}</strong></Card><Card><span className="metric-icon coral"><Target size={19} /></span><span className="metric-label">Success rate</span><strong className="metric-value">{stats.successRate || 0}%</strong></Card><Card><span className="metric-icon gold"><Flame size={19} /></span><span className="metric-label">Current streak</span><strong className="metric-value">{stats.currentStreak || 0} days</strong></Card></section>
      <div className="feature-grid two-one"><Card className="chart-panel"><div className="panel-heading"><div><p className="eyebrow">CONSISTENCY OVER TIME</p><h2>7-day improvement</h2></div><span className="chart-legend"><i /> Tried <i className="legend-gold" /> Completed</span></div><WeeklyChart data={data?.sevenDayProgress} /><div className="chart-footnote">Today's progress: <b>{stats.todayProgress || 0}</b> practice submissions</div></Card><Card className="chart-panel"><div className="panel-heading"><div><p className="eyebrow">QUIZ SKILLS</p><h2>Topic performance</h2></div></div>{topicData.some((topic) => topic.attempts) ? <TopicChart data={topicData} /> : <div className="empty-chart"><span className="metric-icon coral"><Target size={20} /></span><b>Your topic chart starts with a quiz.</b><p>Try today's question to start seeing patterns.</p></div>}</Card></div>
      <Card className="weak-rescue"><div className="rescue-mark"><Flame size={21} /></div><div><p className="eyebrow">WEAK AREA RESCUE</p><h2>{weakest ? `${weakest.topic} could use another pass` : "Your next practice session is a fresh start"}</h2><p>{weakest ? `Your quiz accuracy is ${weakest.score}% across ${weakest.attempts} ${weakest.attempts === 1 ? "attempt" : "attempts"}. A short, focused practice session can make the concepts stick.` : "Take the daily quiz and your topic strengths will appear here. In the meantime, choose one topic and talk it through with the tutor."}</p></div><Link className="button button-dark" to={weakest ? "/feature4" : "/feature3"}>{weakest ? "Practice now" : "Ask the tutor"} <ArrowRight size={16} /></Link></Card>
      <Card className="achievement-strip"><div className="award-mark"><Award size={21} /></div><div><p className="eyebrow">CODING ACHIEVEMENTS</p><h2>{stats.completed > 0 ? "First solution, earned." : "Your first milestone is close."}</h2><p>{stats.completed > 0 ? `${stats.completed} problems marked mastered. Each one is proof you worked through the thinking.` : "Save your first practice submission, review it, and mark the problem mastered when you are ready."}</p></div><span className="achievement-count">{stats.completed || 0}<small> mastered</small></span></Card>
    </main></>
  );
}

export default Feature5;