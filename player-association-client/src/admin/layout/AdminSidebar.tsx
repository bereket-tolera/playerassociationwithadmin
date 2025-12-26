import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const activeClass = "bg-blue-500 text-white px-4 py-2 rounded";
  const defaultClass = "px-4 py-2 hover:bg-blue-200 rounded";

  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/players"
          className={({ isActive }) => (isActive ? activeClass : defaultClass)}
        >
          Players
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) => (isActive ? activeClass : defaultClass)}
        >
          Events
        </NavLink>
        <NavLink
          to="/admin/insights"
          className={({ isActive }) => (isActive ? activeClass : defaultClass)}
        >
          Insights
        </NavLink>
      </nav>
    </div>
  );
}
