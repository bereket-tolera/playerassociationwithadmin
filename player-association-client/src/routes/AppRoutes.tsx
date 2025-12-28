import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Home from "../pages/Home";
import Players from "../pages/Players";
import Events from "../pages/Events";
import Insights from "../pages/Insights";
// import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import ProtectedRoute from "../pages/ProtectedRoute";
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
        <Route path="/login" element={<Login />} />
        
        {/* Admin Panel */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Nested routes under /admin */}
          <Route index element={<Navigate to="players" replace />} />
          <Route path="players" element={<PlayerList />} />
          <Route path="events" element={<EventList />} />
          <Route path="insights" element={<InsightList />} />
        </Route>
        
        {/* Legacy admin routes (optional, can be removed) */}
        <Route path="/admin/players" element={
          <ProtectedRoute>
            <PlayerList />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute>
            <EventList />
          </ProtectedRoute>
        } />
        <Route path="/admin/insights" element={
          <ProtectedRoute>
            <InsightList />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}