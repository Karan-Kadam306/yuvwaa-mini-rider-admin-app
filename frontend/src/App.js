import { BrowserRouter, Routes, Route } from "react-router-dom";
import RidersPage from "./pages/RidersPage";
import BikesPage from "./pages/BikesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", background: "#eee" }}>
        <Link style={{ marginRight: "20px" }} to="/riders">Riders</Link>
        <Link style={{ marginRight: "20px" }} to="/bikes">Bikes</Link>
        <Link to="/assignments">Assignments</Link>
      </div>

      <Routes>
        <Route path="/" element={<RidersPage />} />
        <Route path="/riders" element={<RidersPage />} />
        <Route path="/bikes" element={<BikesPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
