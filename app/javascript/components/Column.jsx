// app/javascript/components/Column.jsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = ({ column, tasks, handleDelete, handleAddTask, handleEditClick }) => (
  <div className="column bg-sky-800 shadow-xl p-2 rounded-lg flex flex-col gap-2 h-min">
  <div className="text-lg font-medium text-white">{column.title}</div>
  <Droppable droppableId={column.id}>
  {(provided) => (
    <div
    {...provided.droppableProps}
    ref={provided.innerRef}
    className="task-list flex flex-col gap-1"
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
  <button className="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-md hover:cursor-pointer hover:bg-sky-600 w-min whitespace-nowrap" onClick={() => handleAddTask(column.id)}>Add Task</button>
  </div>
  );

export default Column;
