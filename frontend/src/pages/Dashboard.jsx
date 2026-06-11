import { useEffect, useState,useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import TaskDetailModal from "../components/TaskDetailModal.jsx";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/api.js";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewTaskId, setViewTaskId] = useState(null);
  const firstRender = useRef(true);

  const fetchTasks = async (searchVal = search, pageVal = page) => {
    try {
      setLoading(true);
      const res = await getTasks({
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

  useEffect(() => {
    
    fetchTasks();
  }, [page]);

  // debounce
  useEffect(() => {
if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchTasks(search, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreate = async (form) => {
    try {
      await createTask(form);
      toast.success("Task created");
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

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
      console.log(tasks.length, page);

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

  const handleEditClick = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/*  header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-(--color-text-primary)">
            My Tasks
          </h2>
          <p className="text-sm text-(--color-text-secondary)">
            Manage and track your tasks
          </p>
        </div>

        {/* Search  */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-(--color-surface) text-(--color-text-primary) px-4 py-2 rounded-lg text-sm outline-none border border-(--color-border) focus:border-(--color-primary)"
          />
          <button
            onClick={() => {
              setEditTask(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-(--color-primary) text-(--color-surface) rounded-lg text-sm font-semibold cursor-pointer shrink-0 hover:bg-(--color-primary-hover)"
          >
            + Add Task
          </button>
        </div>

        {/* Tasks */}
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
            <p
              className="text-lg font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No tasks found
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Click "+ Add Task" to create your first task
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
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
              className="text-sm font-medium"
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
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={editTask ? handleUpdate : handleCreate}
        editTask={editTask}
      />

      {/*  Detail Modal */}
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

export default Dashboard;
