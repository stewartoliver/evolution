import React, { useState } from "react";

const EditTaskForm = ({ task, onSave }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "todo");
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [priority, setPriority] = useState(task.priority || "");
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || "");
  const [estimatedTime, setEstimatedTime] = useState(task.estimated_time || "");
  const [actualTime, setActualTime] = useState(task.actual_time || "");
  const [tags, setTags] = useState(task.tags || "");
  const [isRecurring, setIsRecurring] = useState(task.is_recurring || false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    task.recurrence_interval || "",
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...task,
      title,
      description,
      status,
      due_date: dueDate,
      priority,
      assigned_to: assignedTo,
      estimated_time: estimatedTime,
      actual_time: actualTime,
      tags,
      is_recurring: isRecurring,
      recurrence_interval: recurrenceInterval,
    });
  };

  const inputClass =
    "rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Task Details Section */}
      <div className="flex flex-col gap-2 w-full md:flex-row md:gap-4">
        <div className="flex flex-col gap-4 w-full md:w-2/3">
          {/* Title */}
          <div className="w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl text-text-light dark:text-text-dark border-x-0 border-t-0 border-b-2 border-background-input-light dark:border-background-input-dark focus:border-primary-500 focus:dark:border-primary-500 focus:border-b-2 focus:ring-0 focus:outline-none bg-background-card-light dark:bg-background-card-dark w-full whitespace-prewrap"/>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-description" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Description:
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[100px]`}
              rows={Math.max(description.split("\n").length, 2)}
            />
          </div>
        </div>

        {/* Task Settings Section */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          {/* Status */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-status" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Status:
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-due-date" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Due Date:
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-priority" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Priority:
            </label>
            <input
              id="task-priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Actual Time */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-actual-time" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Actual Time (hours):
            </label>
            <input
              id="task-actual-time"
              type="number"
              step="0.01"
              value={actualTime}
              onChange={(e) => setActualTime(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="task-tags" className="block text-sm font-medium text-text-light dark:text-text-dark">
              Tags:
            </label>
            <input
              id="task-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Is Recurring */}
          <div className="w-full flex items-center gap-1">
            <input
              id="task-is-recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded-sm border-0 focus:border-0 shadow-sm focus:ring-0 text-primary-500 bg-background-input-light dark:bg-background-input-dark"
            />
            <label htmlFor="task-is-recurring" className="text-sm font-medium text-text-light dark:text-text-dark">
              Is Recurring
            </label>
          </div>

          {/* Recurrence Interval */}
          {isRecurring && (
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="task-recurrence-interval" className="block text-sm font-medium text-text-light dark:text-text-dark">
                Recurrence Interval:
              </label>
              <input
                id="task-recurrence-interval"
                type="text"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
