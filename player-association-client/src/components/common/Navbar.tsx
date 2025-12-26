import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Player Association</h1>

      <ul className="flex gap-6">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/players">Players</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/insights">Insights</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
}
