import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ConfirmationModal from './ConfirmationModal';

const TaskListView = ({ tasks, setTasks, handleDelete, handleEditClick, handleAddTask }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeRef, setActiveRef] = useState(null);

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  // Sort tasks within each group by priority and creation date
  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      // Task moved to a different status
      const task = tasks.find(t => t.id.toString() === draggableId);
      if (task) {
        // Create a new task object with only the necessary fields
        const updatedTask = {
          id: task.id,
          status: destination.droppableId
        };
        
        // Update local state immediately for better UX
        setTasks(prevTasks => prevTasks.map(t => 
          t.id === task.id ? { ...t, status: destination.droppableId } : t
        ));
        
        // Call handleEditClick with the minimal updated task and true to indicate this is a drag operation
        handleEditClick(updatedTask, true);
      }
    }
  };

  const handleDeleteClick = (task, event) => {
    event.stopPropagation();
    setSelectedTask(task);
    setActiveRef(event.currentTarget);
    setDeleteModalOpen(true);
  };

  const handleStatusChange = (task, event) => {
    event.stopPropagation();
    setSelectedTask(task);
    setActiveRef(event.currentTarget);
    setStatusModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      handleDelete(selectedTask.id);
      setDeleteModalOpen(false);
      setSelectedTask(null);
      setActiveRef(null);
    }
  };

  const confirmStatusChange = () => {
    if (selectedTask) {
      const updatedTask = {
        ...selectedTask,
        status: selectedTask.status === 'done' ? 'todo' : 'done'
      };
      handleEditClick(updatedTask, true);
      setStatusModalOpen(false);
      setSelectedTask(null);
      setActiveRef(null);
    }
  };

  const renderTaskList = (status, tasks) => (
    <div className="flex flex-col gap-2">
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[100px] rounded-lg border border-border-light dark:border-border-dark overflow-hidden ${
              snapshot.isDraggingOver ? 'bg-background-input-light dark:bg-background-input-dark' : ''
            }`}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-background-input-light dark:bg-background-input-dark">
                  <th className="px-4 py-2 text-left text-lg font-semibold text-text-light dark:text-text-dark">
                    <h2 className="">
                      {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                    </h2>
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-text-sub dark:text-text-sub-dark w-32"></th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-text-sub dark:text-text-sub-dark w-20">
                    {status !== 'done' && (
                      <button
                        onClick={() => handleAddTask(status)}
                        className="text-text-sub dark:text-text-sub-dark hover:text-primary-500 dark:hover:text-primary-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark min-h-4">
                {sortTasks(tasks).map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? 'shadow-lg' : ''} ${
                          task.status === 'done' ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={task.status === 'done'}
                              onChange={(event) => handleStatusChange(task, event)}
                              className="rounded-sm border-0 focus:border-0 shadow-sm focus:ring-0 text-primary-500 bg-background-input-light dark:bg-background-input-dark checked:bg-primary-500 dark:checked:bg-primary-500 hover:bg-background-input-light dark:hover:bg-background-input-dark"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-sm font-medium text-text-light dark:text-text-dark ${
                                task.status === 'done' ? 'line-through' : ''
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="mt-0.5 text-xs text-text-sub dark:text-text-sub-dark line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {task.due_date && (
                            <div className="flex items-center justify-end gap-1 text-xs text-text-sub dark:text-text-sub-dark whitespace-nowrap">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                              </svg>
                              <span>{new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(task)}
                              className="text-text-sub dark:text-text-sub-dark hover:text-primary-500 dark:hover:text-primary-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={(event) => handleDeleteClick(task, event)}
                              className="text-text-sub dark:text-text-sub-dark hover:text-red-500 dark:hover:text-red-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-6">
        {renderTaskList('todo', groupedTasks.todo || [])}
        {renderTaskList('in_progress', groupedTasks.in_progress || [])}
        {renderTaskList('done', groupedTasks.done || [])}
      </div>

      {deleteModalOpen && (
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedTask(null);
            setActiveRef(null);
          }}
          onConfirm={confirmDelete}
          confirmText="Delete"
          type="delete"
          anchorRef={activeRef}
        />
      )}

      {statusModalOpen && (
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedTask(null);
            setActiveRef(null);
          }}
          onConfirm={confirmStatusChange}
          confirmText={selectedTask?.status === 'done' ? "Uncheck" : "Check"}
          type="confirm"
          anchorRef={activeRef}
        />
      )}
    </DragDropContext>
  );
};

export default TaskListView; 