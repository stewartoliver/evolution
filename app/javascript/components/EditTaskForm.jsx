import React, { useState } from 'react';

const EditTaskForm = ({ task, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [priority, setPriority] = useState(task.priority || '');
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || '');
  const [estimatedTime, setEstimatedTime] = useState(task.estimated_time || '');
  const [actualTime, setActualTime] = useState(task.actual_time || '');
  const [tags, setTags] = useState(task.tags || '');
  const [isRecurring, setIsRecurring] = useState(task.is_recurring || false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(task.recurrence_interval || '');

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
    'rounded-md border bg-gray-100 border-gray-50 focus:border-sky-500 text-gray-500 font-medium text-sm focus:ring-0 w-full';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {/* Task Details Section */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:gap-4">
          <div className="flex flex-col gap-2 w-full md:w-2/3">
            {/* Title */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Task Title:</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md border bg-gray-100 border-gray-50 focus:border-sky-500 text-gray-500 font-medium text-xl focus:ring-0 w-full whitespace-pre-wrap resize-none"
                rows={2}
              />
            </div>

            {/* Description */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} min-h-[100px]`}
                rows={Math.max(description.split('\n').length, 2)}
              />
            </div>
          </div>

          {/* Task Settings Section */}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            {/* Status */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Status:</label>
              <select
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
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Due Date:</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Priority */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Priority:</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Actual Time */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Actual Time (hours):</label>
              <input
                type="number"
                step="0.01"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Tags */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Tags:</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Is Recurring */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Is Recurring:</label>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-0 sm:text-sm text-gray-500"
              />
            </div>

            {/* Recurrence Interval */}
            {isRecurring && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Recurrence Interval:</label>
                <input
                  type="text"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
