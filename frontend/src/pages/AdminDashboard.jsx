import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import TaskDetailModal from "../components/TaskDetailModal.jsx";
import {
  getAdminTasks,
  getAdminUsers,
  updateTask,
  deleteTask,
} from "../services/api.js";

import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" | "users"
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isFirstRender = useRef(true);
  const isTabSwitch = useRef(false);
  const [viewTaskId, setViewTaskId] = useState(null);

  const fetchTasks = async (searchVal = search, pageVal = page) => {
    try {
      setLoading(true);
      const res = await getAdminTasks({
        search: searchVal,
        page: pageVal,
        limit: 6,
      });
      setTasks(res.data.tasks);
      setTotalPages(res.data.pages);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isTabSwitch.current = true;
    if (activeTab === "tasks") fetchTasks();
    else fetchUsers();
  }, [activeTab, page]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if(isTabSwitch.current){
      isTabSwitch.current = false;
      return
    }
    if (activeTab !== "tasks") return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchTasks(search, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);


  const handleUpdate = async (form) => {
    try {
      await updateTask(editTask._id, form);
      toast.success("Task updated");
      setEditTask(null);
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      // if last item on current page, go back one page
      if (tasks.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      toast.success(task.completed ? "Marked as pending" : "Marked as done");
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Admin Panel
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Manage all tasks and users
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          {["tasks", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium cursor-pointer capitalize transition-colors"
              style={{
                backgroundColor:
                  activeTab === tab ? "var(--color-primary)" : "transparent",
                color: activeTab === tab ? "#ffffff" : "var(--color-primary)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <>
            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-border)")
              }
            />

            {loading ? (
              <div className="flex justify-center py-16">
                <div
                  className="w-10 h-10 border-4 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--color-primary-light)",
                    borderTopColor: "var(--color-primary)",
                  }}
                />
              </div>
            ) : tasks.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <p style={{ color: "var(--color-text-secondary)" }}>
                  No tasks found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={(task) => {
                      setEditTask(task);
                      setModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onView={(id) => setViewTaskId(id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor:
                      page === 1
                        ? "var(--color-border)"
                        : "var(--color-primary-light)",
                    color:
                      page === 1
                        ? "var(--color-text-muted)"
                        : "var(--color-primary)",
                  }}
                >
                  Previous
                </button>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor:
                      page === totalPages
                        ? "var(--color-border)"
                        : "var(--color-primary-light)",
                    color:
                      page === totalPages
                        ? "var(--color-text-muted)"
                        : "var(--color-primary)",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            {loading ? (
              <div className="flex justify-center py-16">
                <div
                  className="w-10 h-10 border-4 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--color-primary-light)",
                    borderTopColor: "var(--color-primary)",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between px-5 py-4 rounded-xl shadow-sm"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {u.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {u.email}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          u.role === "admin"
                            ? "var(--color-primary-light)"
                            : "var(--color-bg)",
                        color:
                          u.role === "admin"
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleUpdate}
        editTask={editTask}
      />

        {/* Detail Modal */}
      <TaskDetailModal
        taskId={viewTaskId}
        onClose={() => setViewTaskId(null)}
        onEdit={(task) => {
          setViewTaskId(null);
          setEditTask(task);
          setModalOpen(true);
        }}
        onDelete={(id) => {
          setViewTaskId(null);
          handleDelete(id);
        }}
        onToggle={(task) => {
          setViewTaskId(null);
          handleToggle(task);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
