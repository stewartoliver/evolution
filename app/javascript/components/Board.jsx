import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import TaskViewToggle from './TaskViewToggle';
import TaskListView from './TaskListView';
import ConfirmationModal from './ConfirmationModal';

const Board = ({ goalId, onEditClick, onDeleteClick, onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('board');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, [goalId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/objectives/tasks/filter_by_goal?goal_id=${goalId}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tasks: ${errorText}`);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleTaskEdit = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const task = tasks.find(t => t.id.toString() === draggableId);
    
    if (!task) return;

    // Create updated task with new status
    const updatedTask = {
      ...task,
      status: destination.droppableId
    };

    // Update local state immediately for better UX
    const newTasks = tasks.map(t => 
      t.id.toString() === draggableId ? updatedTask : t
    );
    setTasks(newTasks);

    // Call parent's onEditClick with the updated task and isDragOperation flag
    // This will update the backend
    onEditClick(updatedTask, true);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`/objectives/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
      }

      setTasks(tasks.filter(task => task.id !== taskId));
      onDeleteClick(taskId);
      setDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleAddTask = (status) => {
    onAddTask(status);
  };

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <TaskListView
            tasks={tasks}
            setTasks={setTasks}
            handleDelete={handleTaskDelete}
            handleEditClick={(task, isDragOperation) => onEditClick(task, isDragOperation)}
            handleAddTask={handleAddTask}
          />
        );
      case 'board':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['todo', 'in_progress', 'done'].map((status) => {
              const statusTasks = tasks.filter(task => task.status === status);
              return (
                <div key={status} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                    </h2>
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
                  </div>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`px-2 py-4 rounded-lg bg-background-card dark:bg-background-card-dark ${
                          snapshot.isDraggingOver ? 'bg-background-input-light dark:bg-background-input-dark' : ''
                        } ${statusTasks.length === 0 ? 'min-h-1' : ''}`}
                      >
                        {statusTasks.map((task, index) => {
                          const draggableId = task.id.toString();
                          return (
                            <Draggable 
                              key={draggableId}
                              draggableId={draggableId}
                              index={Number(index)}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-4 last:mb-0 ${snapshot.isDragging ? 'shadow-lg' : ''} ${
                                    task.status === 'done' ? 'opacity-50' : ''
                                  }`}
                                >
                                  <Task
                                    task={task}
                                    onEditClick={() => onEditClick(task, false)}
                                    onDeleteClick={() => handleDeleteClick(task)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start w-full">
        <TaskViewToggle currentView={currentView} onViewChange={handleViewChange} />
      </div>
      <DragDropContext onDragEnd={handleTaskEdit}>
        {renderView()}
      </DragDropContext>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => selectedTask && handleTaskDelete(selectedTask.id)}
        confirmText="Delete"
        type="delete"
        anchorRef={deleteButtonRef}
      />
    </div>
  );
};

export default Board;
