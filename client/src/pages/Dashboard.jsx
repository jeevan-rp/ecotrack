import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Car, Utensils, Zap as EnergyIcon, ShoppingBag, Target, Flame, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

const getCategoryIcon = (category) => {
  switch(category) {
    case 'transport': return <Car className="text-mint w-5 h-5"/>;
    case 'diet': return <Utensils className="text-mint w-5 h-5"/>;
    case 'energy': return <EnergyIcon className="text-mint w-5 h-5"/>;
    case 'shopping': return <ShoppingBag className="text-mint w-5 h-5"/>;
    default: return <Zap className="text-mint w-5 h-5"/>;
  }
};



export default function Dashboard() {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [insight, setInsight] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [totalEmissions, setTotalEmissions] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [logsRes, insightsRes] = await Promise.all([
          fetch(`${API_URL}/api/logs`, { headers }),
          fetch(`${API_URL}/api/insights`, { headers })
        ]);
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData.slice(0, 5));
          
          const total = logsData.reduce((sum, log) => sum + (log.co2Impact || 0), 0);
          setTotalEmissions(total.toFixed(1));

          const recentLogsForChart = logsData.slice(0, 7).reverse();
          const mappedChartData = recentLogsForChart.map(log => ({
            name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
            co2: log.co2Impact || 0
          }));
          
          if (mappedChartData.length === 0) {
            setChartData([{ name: 'No Data', co2: 0 }]);
          } else {
            setChartData(mappedChartData);
          }
        }

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json();
          if (insightsData.length > 0) setInsight(insightsData[0]);
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, [user]);

  const weeklyBudget = user?.weeklyBudget || 50;
  const budgetPercentage = Math.min((totalEmissions / weeklyBudget) * 100, 100);
  const isOverBudget = totalEmissions > weeklyBudget;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-mint">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-mint">Track, analyze, and reduce your carbon footprint.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress & Quick Stats */}
        <div className="glass-panel p-6 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-lime" /> Weekly Budget
            </h3>
            <span className={`font-bold ${isOverBudget ? 'text-red-400' : 'text-accent-green'}`}>
              {totalEmissions} / {weeklyBudget} kg
            </span>
          </div>
          
          <div className="w-full bg-forest-dark/50 rounded-full h-4 mb-4 overflow-hidden border border-white/10">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-accent-green shadow-[0_0_10px_rgba(0,255,163,0.5)]'}`}
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>

          {/* Gamification Stats */}
          {user && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Flame className={`w-6 h-6 ${user.currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                <div>
                  <div className="text-xs text-mint">Streak</div>
                  <div className="font-bold">{user.currentStreak || 0} Days</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-xs text-mint">Badges</div>
                  <div className="font-bold">{user.badges?.length || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Panel */}
        <div className="glass-panel p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Emissions Trend</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#A3C6B9" tick={{fill: '#A3C6B9'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#A3C6B9" tick={{fill: '#A3C6B9'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112A22', borderColor: '#00FFA3', borderRadius: '8px' }}
                  itemStyle={{ color: '#00FFA3' }}
                />
                <Area type="monotone" dataKey="co2" stroke="#00FFA3" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {logs.length === 0 ? (
            <p className="text-mint text-sm">No activities logged yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {getCategoryIcon(log.category)}
                    </div>
                    <div>
                      <p className="font-medium">{log.description || log.category}</p>
                      <p className="text-xs text-mint">{new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="font-bold text-accent-lime">+{log.co2Impact} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gemini Insight */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-lime opacity-10 rounded-full blur-3xl"></div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="text-accent-lime w-5 h-5" /> AI Insight
          </h3>
          {insight ? (
            <>
              <p className="text-mint text-sm leading-relaxed mb-4">
                "{insight.actionableTip || insight.trendSummary}"
              </p>
              <Link to="/insights" className="block text-center text-sm font-medium text-forest-dark bg-accent-green px-4 py-2 rounded-lg hover:bg-accent-lime transition-colors w-full">
                View Deep Analysis
              </Link>
            </>
          ) : (
            <>
              <p className="text-mint text-sm leading-relaxed mb-4">
                "No insights generated yet. Log more activities and head to the Insights page to get your personalized AI analysis!"
              </p>
              <Link to="/insights" className="block text-center text-sm font-medium text-forest-dark bg-accent-green px-4 py-2 rounded-lg hover:bg-accent-lime transition-colors w-full">
                Generate Insight
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
