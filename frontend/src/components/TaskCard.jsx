const truncate = (text, limit = 37) => {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

const TaskCard = ({ task, onEdit, onDelete, onToggle, onView }) => {
  return (
    <div
      className="rounded-xl p-5 shadow-sm flex flex-col gap-3 transition-shadow hover:shadow-md cursor-pointer"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
      onClick={() => onView(task._id)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-base font-semibold ${
            task.completed ? "line-through opacity-50" : ""
          }`}
          style={{ color: "var(--color-text-primary)" }}
        >
          {task.title}
        </h3>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
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
      </div>

      {task.description && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {truncate(task.description)}
        </p>
      )}

      {task.createdBy?.name && (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          By: {task.createdBy.name}
        </p>
      )}

      <div
        className="flex items-center justify-between mt-1"
        onClick={(e) => e.stopPropagation()} // prevent card click when clicking buttons
      >
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {new Date(task.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(task)}
            className="text-xs px-3 py-1 rounded-lg cursor-pointer"
            style={{
              backgroundColor: task.completed
                ? "var(--color-error-light)"
                : "var(--color-primary-light)",
              color: task.completed
                ? "var(--color-error)"
                : "var(--color-primary)",
            }}
          >
            {task.completed ? "Undo" : "Done"}
          </button>

          <button
            onClick={() => onEdit(task)}
            className="text-xs px-3 py-1 rounded-lg cursor-pointer"
            style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-xs px-3 py-1 rounded-lg cursor-pointer"
            style={{
              backgroundColor: "var(--color-error-light)",
              color: "var(--color-error)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
