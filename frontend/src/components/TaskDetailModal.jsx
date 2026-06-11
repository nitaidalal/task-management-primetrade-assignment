import { useEffect, useState } from "react";
import { getTask } from "../services/api.js";
import toast from "react-hot-toast";

const TaskDetailModal = ({ taskId, onClose, onEdit, onDelete, onToggle }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch task details
  useEffect(() => {
    if (!taskId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getTask(taskId);
        setTask(res.data.task);
      } catch {
        toast.error("Failed to load task");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col gap-5"
        style={{ backgroundColor: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Task Detail
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{
                borderColor: "var(--color-primary-light)",
                borderTopColor: "var(--color-primary)",
              }}
            />
          </div>
        ) : task ? (
          <>
            {/* Status */}
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full w-fit"
              style={{
                backgroundColor: task.completed
                  ? "var(--color-primary-light)"
                  : "var(--color-error-light)",
                color: task.completed
                  ? "var(--color-primary)"
                  : "var(--color-error)",
              }}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <p
                className="text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                TITLE
              </p>
              <p
                className={`text-base font-semibold ${
                  task.completed ? "line-through opacity-50" : ""
                }`}
                style={{ color: "var(--color-text-primary)" }}
              >
                {task.title}
              </p>
            </div>

            {/* Description */}
            {task.description && (
              <div className="flex flex-col gap-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  DESCRIPTION
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {task.description}
                </p>
              </div>
            )}

            {/* Created by */}
            {task.createdBy?.name && (
              <div className="flex flex-col gap-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  CREATED BY
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {task.createdBy.name} ({task.createdBy.email})
                </p>
              </div>
            )}

            {/* Date */}
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Created:{" "}
              {new Date(task.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap pt-1">
              <button
                onClick={() => {
                  onToggle(task);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: task.completed
                    ? "var(--color-error-light)"
                    : "var(--color-primary-light)",
                  color: task.completed
                    ? "var(--color-error)"
                    : "var(--color-primary)",
                }}
              >
                {task.completed ? "Mark Pending" : "Mark Done"}
              </button>

              <button
                onClick={() => {
                  onEdit(task);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  onDelete(task._id);
                  onClose();
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: "var(--color-error-light)",
                  color: "var(--color-error)",
                }}
              >
                Delete
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TaskDetailModal;
