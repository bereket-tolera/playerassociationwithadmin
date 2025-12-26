import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Home from "../pages/Home";
import Players from "../pages/Players";
import Events from "../pages/Events";
import Insights from "../pages/Insights";
// import NotFound from "../pages/NotFound";

// Admin Pages
import AdminLayout from "../admin/layout/AdminLayout";
import PlayerList from "../admin/players/PlayerList";
import EventList from "../admin/events/EventList";
import InsightList from "../admin/insights/InsightList";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* User-facing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/events" element={<Events />} />
        <Route path="/insights" element={<Insights />} />
        {/* <Route path="*" element={<NotFound />} /> */}

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="players" element={<PlayerList />} />
          <Route path="events" element={<EventList />} />
          <Route path="insights" element={<InsightList />} />
          <Route index element={<Navigate to="players" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
