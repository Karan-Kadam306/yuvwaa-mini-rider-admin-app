import React from "react";
import { LayoutDashboard, Users, Bike, ClipboardList, Settings, LogOut, Activity } from "lucide-react";

export function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "riders", icon: Users, label: "Riders" },
    { id: "bikes", icon: Bike, label: "Bikes" },
    { id: "assignments", icon: ClipboardList, label: "Assignments" },
    { id: "activity", icon: Activity, label: "Activity" },
  ];

  return (
    <aside className="w-20 bg-white border-r border-green-200 flex flex-col items-center py-8 shadow-md">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md 
              animate-pulse ring-2 ring-green-300 ring-offset-2">
          <Bike className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-green-500 shadow-lg"
                  : "bg-white hover:bg-green-50 shadow-sm"
              }`}
              title={item.label}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-green-700"}`} />

              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="mt-auto flex flex-col gap-4">
        <button className="relative group flex items-center justify-center w-12 h-12 rounded-xl bg-white hover:bg-green-50 shadow-sm transition-all duration-300">
          <Settings className="w-6 h-6 text-green-700" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-green-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-nowrap shadow-md">
            Settings
          </span>
        </button>
        <button onClick={onLogout} className="relative group flex items-center justify-center w-12 h-12 rounded-xl bg-white hover:bg-red-50 shadow-sm transition-all duration-300">
          <LogOut className="w-6 h-6 text-green-700 group-hover:text-red-500" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-green-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 whitespace-nowrap shadow-md">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

