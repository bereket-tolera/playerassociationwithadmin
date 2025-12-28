import { NavLink, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  onLogout?: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';
  
  const activeClass = "bg-blue-600 text-white px-4 py-2 rounded";
  const defaultClass = "px-4 py-2 text-gray-700 hover:bg-gray-200 rounded";

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Call parent logout if provided
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Welcome, {username}</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => (isActive ? activeClass : defaultClass)}
        >
          Dashboard
        </NavLink>
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
      
      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}