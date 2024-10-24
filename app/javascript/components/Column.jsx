// app/javascript/components/Column.jsx
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({
  column,
  tasks,
  handleDelete,
  handleAddTask,
  handleEditClick,
}) => (
  <div className="column bg-background-card-light dark:bg-background-card-dark shadow-xl p-2 rounded-lg flex flex-col gap-2 h-min">
    <div className="text-xl font-semibold text-light dark:text-dark">{column.title}</div>
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="task-list flex flex-col gap-2"
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
    <button
      className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition whitespace-nowrap w-min"
      onClick={() => handleAddTask(column.id)}
    >
      Add Task
    </button>
  </div>
);

export default Column;
