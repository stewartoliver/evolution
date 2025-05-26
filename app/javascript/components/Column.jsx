// app/javascript/components/Column.jsx
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({
  column,
  tasks,
  handleDelete,
  handleAddTask,
  handleEditClick,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      handleAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div className="column bg-background-card-light dark:bg-background-card-dark shadow-xl p-4 rounded-lg flex flex-col gap-4 h-min">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-text-light dark:text-text-dark flex items-center gap-2">
          <span>{column.title}</span>
          <span className="text-sm text-text-sub dark:text-text-sub-dark bg-background-input-light dark:bg-background-input-dark px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          className="text-text-sub dark:text-text-sub-dark hover:text-primary-500 dark:hover:text-primary-500 transition-colors"
          onClick={() => setIsAddingTask(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`task-list flex flex-col gap-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-background-input-light dark:bg-background-input-dark rounded-md h-min' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                handleDelete={handleDelete}
                handleEditClick={handleEditClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingTask && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full p-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle("");
              }}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Column;
