import React, { useState } from "react";
import { Sidebar } from "./layout/sideBar";
import DashboardPage from "./pages/Dashboard";
import RidersPage from "./pages/RidersPage";
import BikesPage from "./pages/BikesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import Home from "./pages/Home";
import LogoutModal from "./pages/LogoutModal";
import ActivityPage from "./pages/activityPage";

function App() {
  const [showHome, setShowHome] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // NEW STATES
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Open confirmation modal
  const requestLogout = () => {
    setShowLogoutModal(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    setFadeOut(true);

    setTimeout(() => {
      setShowHome(true);
      setFadeOut(false);
      setActiveTab("dashboard");
      setShowLogoutModal(false);
    }, 600);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "riders":
        return <RidersPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "bikes":
        return <BikesPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "assignments":
        return <AssignmentsPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "activity":
        return <ActivityPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <DashboardPage activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  // Show landing page
  if (showHome) {
    return <Home enterDashboard={() => setShowHome(false)} />;
  }

  return (
    <div
      className={`flex bg-gray-50 min-h-screen transition-all duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={requestLogout}
      />

      <main className="flex-1 p-6">{renderContent()}</main>

      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </div>
  );
}

export default App;
