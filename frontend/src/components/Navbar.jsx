import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-(--color-surface) border-b border-(--color-border) px-4 py-3 shadow-sm ">
      <div className="flex items-center justify-between">
        <div
          className="text-xl text-(--color-primary) font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          TaskManager
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <NavItems
            user={user}
            navigate={navigate}
            handleLogout={handleLogout}
          />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-(--color-primary) text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col border-t border-(--color-border) mt-3 gap-3 pt-4 pb-2">
          <div className="text-sm text-(--color-text-primary) font-medium">
            {user?.name}
          </div>

          {user?.role === "admin" && (
            <>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMenuOpen(false);
                }}
                className="text-sm bg-(--color-primary-light) text-(--color-primary) font-medium px-3 py-2 rounded-lg text-left cursor-pointer"
              >
                My Tasks
              </button>
              <button
                onClick={() => {
                  navigate("/admin");
                  setMenuOpen(false);
                }}
                className="text-sm bg-(--color-primary-light) text-(--color-primary) font-medium px-3 py-2 rounded-lg text-left cursor-pointer"
              >
                Admin Panel
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="text-sm bg-(--color-primary) text-(--color-surface) font-semibold px-3 py-2 rounded-lg text-left cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

// desktop nav items
const NavItems = ({ user, navigate, handleLogout }) => (
  <>
    <div
      className="text-sm text-(--color-text-primary) font-medium"
    >
      {user?.name}
    </div>


    {user?.role === "admin" && (
      <>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm bg-(--color-primary-light) text-(--color-primary) font-medium px-3 py-1 rounded-lg cursor-pointer hover:bg-(--color-primary-soft)"

        >
          My Tasks
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="text-sm bg-(--color-primary-light) text-(--color-primary) font-medium px-3 py-1 rounded-lg cursor-pointer hover:bg-(--color-primary-soft)"   
        >
          Admin Panel
        </button>
      </>
    )}

    <button
      onClick={handleLogout}
      className="text-sm bg-(--color-primary) text-(--color-surface) font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-(--color-primary-hover)"
    >
      Logout
    </button>
  </>
);

export default Navbar;
