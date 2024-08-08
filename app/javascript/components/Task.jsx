import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, handleDelete, handleEditClick }) => (
  <Draggable draggableId={task.id.toString()} index={index}>
    {(provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className="task flex justify-between gap-2 bg-white border-gray-500 border rounded-lg text-gray-500 px-2 py-1"
      >
        <div>{task.title}</div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex gap-2 items-center text-gray-700">
            <div>
              <button onClick={() => handleEditClick(task)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 hover:text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
            <div>
              <button onClick={() => handleDelete(task.id)} className="delete-task hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-gray-500">
            {task.description && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            )}
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

export default Task;
