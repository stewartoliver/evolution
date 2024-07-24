import React, { useState } from 'react';

const EditTaskForm = ({ task, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...task, title, description, status });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-0 sm:text-sm text-gray-500"
        />
      </div>
      <div className="w-fit">
        <label className="block text-gray-700 font-medium text-sm">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-0 sm:text-sm text-gray-500"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-0 sm:text-sm text-gray-500"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="sky-btn"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
