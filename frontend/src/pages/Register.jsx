import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if(form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-sm flex flex-col gap-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            TaskManager
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Create your account
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Nitai Dalal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-(--color-bg) text-(--color-text-primary) border border-(--color-border) focus:border-(--color-primary) px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="nitai@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-(--color-bg) text-(--color-text-primary)) border border-(--color-border) focus:border-(--color-primary) px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters with a number"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-(--color-bg) text-(--color-text-primary) border border-(--color-border) focus:border-(--color-primary) px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors mt-1"
            style={{
              backgroundColor: loading
                ? "var(--color-primary-soft)"
                : "var(--color-primary)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.target.style.backgroundColor = "var(--color-primary-hover)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                e.target.style.backgroundColor = "var(--color-primary)";
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p
          className="text-sm text-center"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
