import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-[#8494FF] text-white px-6 py-3 flex justify-between items-center">
      <h2 className="font-semibold text-lg">TASK MANAGER</h2>

      <div className="flex gap-4 items-center text-sm">
        <Link to="/dashboard" className="hover:underline">DASHBOARD</Link>

        <Link to="/tasks" className="hover:underline">TASKS</Link>

        {user?.role === "admin" && (
          <Link to="/projects" className="hover:underline">PROJECTS</Link>
        )}

        <button onClick={handleLogout} className="bg-white text-[#8494FF] px-3 py-1 rounded">
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default Navbar;