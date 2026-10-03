import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyChart({ data = [] }) {
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
    <defs><linearGradient id="attemptFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1b8a70" stopOpacity={0.24} /><stop offset="100%" stopColor="#1b8a70" stopOpacity={0} /></linearGradient></defs>
    <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e7ece8" /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#76817d", fontSize: 12 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#76817d", fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="attempted" stroke="#1b8a70" strokeWidth={2.5} fill="url(#attemptFill)" /><Area type="monotone" dataKey="completed" stroke="#e9a345" strokeWidth={2} fill="transparent" />
  </AreaChart></ResponsiveContainer></div>;
}

export function TopicChart({ data = [] }) {
  const chartData = data.filter((item) => item.attempts > 0);
  return <div className="chart-wrap topic-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 14, left: 10, bottom: 4 }}>
    <CartesianGrid strokeDasharray="3 5" horizontal={false} stroke="#e7ece8" /><XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#76817d", fontSize: 11 }} /><YAxis type="category" dataKey="topic" width={112} tickLine={false} axisLine={false} tick={{ fill: "#596561", fontSize: 11 }} /><Tooltip /><Bar dataKey="score" radius={[0, 4, 4, 0]}>{chartData.map((item, index) => <Cell key={item.topic} fill={index % 2 ? "#e9a345" : "#1b8a70"} />)}</Bar>
  </BarChart></ResponsiveContainer></div>;
}