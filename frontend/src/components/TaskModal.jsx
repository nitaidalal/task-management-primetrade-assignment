import { useEffect, useState } from "react";

const TaskModal = ({ isOpen, onClose, onSubmit, editTask }) => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || "",
        description: editTask.description || "",
      });
    } else {
      setForm({ title: "", description: "" });
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col gap-5"
        style={{ backgroundColor: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {editTask ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold cursor-pointer"
            style={{ color: "var(--color-text-muted)" }}
          >
            ×
          </button>
        </div>

        {/* Title  */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Title <span style={{ color: "var(--color-error)" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg text-sm outline-none"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text-primary)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-primary)")
            }
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Description{" "}
            <span style={{ color: "var(--color-text-muted)" }}>(optional)</span>
          </label>
          <textarea
            placeholder="Enter task description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg text-sm outline-none resize-none"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text-primary)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-primary)")
            }
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
        </div>

        {/* Actions  */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
            style={{
              backgroundColor:
                loading || !form.title.trim()
                  ? "var(--color-primary-soft)"
                  : "var(--color-primary)",
              color: "#ffffff",
            }}
          >
            {loading ? "Saving..." : editTask ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
