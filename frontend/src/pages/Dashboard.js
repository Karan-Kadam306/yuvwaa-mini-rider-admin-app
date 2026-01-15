import React, { useEffect, useState } from "react";
import { Users, Bike, ClipboardList, TrendingUp } from "lucide-react";
import Header from "../layout/header";

function DashboardPage({ activeTab, setActiveTab }) {
  const [stats, setStats] = useState({
    riders: 0,
    bikes: 0,
    assignments: 0,
    availableBikes: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Load dashboard data
  useEffect(() => {
    fetchDashboardStats();
    fetchActivity();
  }, []);

  const API_RIDERS = "http://localhost:5000/api/riders";
  const API_BIKES = "http://localhost:5000/api/bikes";
  const API_ASSIGN = "http://localhost:5000/api/assignments";

  const fetchDashboardStats = async () => {
    const ridersRes = await fetch(API_RIDERS).then((r) => r.json());
    const bikesRes = await fetch(API_BIKES).then((r) => r.json());
    const assignRes = await fetch(API_ASSIGN).then((r) => r.json());

    const available = bikesRes.filter((b) => b.status === "available").length;

    setStats({
      riders: ridersRes.length,
      bikes: bikesRes.length,
      assignments: assignRes.length,
      availableBikes: available,
    });
  };

  const fetchActivity = async () => {
    const assignRes = await fetch(API_ASSIGN).then((r) => r.json());
    const activity = assignRes
      .slice()
      .reverse()
      .map((a, i) => ({
        id: i + 1,
        rider: `${a.first_name} ${a.last_name}`,
        bike: a.bike_code,
        action: "Bike Assigned",
        time: new Date(a.assigned_at).toLocaleString(),
      }));

    setRecentActivity(activity);
  };

  const statCards = [
    {
      id: "riders",
      label: "Total Riders",
      value: stats.riders,
      icon: Users,
      change: "+12%",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
    },
    {
      id: "bikes",
      label: "Total Bikes",
      value: stats.bikes,
      icon: Bike,
      change: "+8%",
      gradient: "from-green-600 to-green-700",
      bgGradient: "from-green-600/10 to-green-700/10",
    },
    {
      id: "assignments",
      label: "Active Assignments",
      value: stats.assignments,
      icon: ClipboardList,
      change: "+18%",
      gradient: "from-green-400 to-green-500",
      bgGradient: "from-green-400/10 to-green-500/10",
    },
    {
      id: "availableBikes",
      label: "Available Bikes",
      value: stats.availableBikes,
      icon: TrendingUp,
      change: `${stats.availableBikes} Available`,
      gradient: "from-green-300 to-green-500",
      bgGradient: "from-green-300/10 to-green-500/10",
    },
  ];

  return (

    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="mt-8">
        <h1 className="text-green-700 mb-2 font-bold text-xl">Dashboard Overview</h1>
        <p className="text-green-600">Welcome back! Here’s your fleet summary.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => setActiveTab(s.id)} 
              className="group relative bg-white rounded-2xl p-6 border border-green-200 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all text-left"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient} rounded-2xl opacity-0 
                group-hover:opacity-100 transition-opacity`}
              ></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${s.gradient} rounded-xl shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-700 text-sm bg-green-100 px-2 py-1 rounded-lg relative z-10">
                    {s.change}
                  </span>
                </div>

                <p className="text-green-600 text-sm mb-1">{s.label}</p>
                <p className="text-green-800 text-2xl font-semibold">{s.value}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-green-200 shadow-md">
          <h2 className="text-green-700 mb-6 font-semibold">Recent Activity</h2>

          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <p className="text-green-600">No recent activity found.</p>
            )}

            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {item.rider.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="text-green-800">{item.action}</p>
                  <p className="text-green-600 text-sm">
                    {item.rider} • {item.bike}
                  </p>
                </div>

                <span className="text-green-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md">
          <h2 className="text-green-700 mb-6 font-semibold">Quick Stats</h2>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-600 text-sm mb-1">Available Bikes</p>
              <p className="text-green-800 font-semibold">{stats.availableBikes}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-600 text-sm mb-1">Assigned Bikes</p>
              <p className="text-green-800 font-semibold">{stats.assignments}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-600 text-sm mb-1">Total Riders</p>
              <p className="text-green-800 font-semibold">{stats.riders}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-green-600 text-sm mb-1">Riders Without Bikes</p>
              <p className="text-green-800 font-semibold">
                {stats.riders - stats.assignments}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
