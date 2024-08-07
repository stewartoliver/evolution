// app/javascript/components/Board.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import Modal from './Modal';
import EditTaskForm from './EditTaskForm';

const Board = ({ goalId }) => {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    in_progress: { id: 'in_progress', title: 'In Progress', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] },
  });

  const [tasks, setTasks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    fetch(`/objectives/tasks/filter_by_goal?goal_id=${goalId}`)
    .then(response => response.json())
    .then(data => {
      const taskMap = {};
      const newColumns = { ...columns };
      data.forEach(task => {
        taskMap[task.id] = task;
        newColumns[task.status].taskIds.push(task.id);
      });
      setTasks(taskMap);
      setColumns(newColumns);
    })
    .catch(error => console.error('Error fetching tasks:', error));
  }, [goalId]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds,
      };

      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      });

      // Update task status in the backend
      fetch(`/objectives/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name=csrf-token]').content,
        },
        body: JSON.stringify({
          task: {
            status: finishColumn.id,
          },
        }),
      });
    }
  };

  const handleDelete = (taskId) => {
    fetch(`/objectives/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name=csrf-token]').content,
      },
    })
    .then(response => {
      if (response.ok) {
        const newTasks = { ...tasks };
        delete newTasks[taskId];

        const newColumns = { ...columns };
        Object.keys(newColumns).forEach(key => {
          newColumns[key].taskIds = newColumns[key].taskIds.filter(id => id !== taskId);
        });

        setTasks(newTasks);
        setColumns(newColumns);
      }
    })
    .catch(error => console.error('Error deleting task:', error));
  };

  const handleAddTask = async (status) => {
    const title = prompt('Enter task title');
    if (title) {
      try {
        const response = await fetch(`/objectives/goals/${goalId}/make_task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('[name=csrf-token]').content,
          },
          body: JSON.stringify({
            task: {
              title,
              status
            },
          }),
        });

        if (response.headers.get('content-type')?.includes('text/html')) {
          throw new Error('Received HTML instead of JSON. Check server for errors.');
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add task: ${errorData.errors.join(', ')}`);
        }

        const newTask = await response.json();
        const newTasks = { ...tasks, [newTask.id]: newTask };
        const newColumns = { ...columns };
        newColumns[status].taskIds.push(newTask.id);
        setTasks(newTasks);
        setColumns(newColumns);
      } catch (error) {
        console.error('Error adding task:', error.message);
      }
    }
  };


  const handleEditClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    // Update task in the backend
    fetch(`/objectives/tasks/${updatedTask.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name=csrf-token]').content,
      },
      body: JSON.stringify({ task: updatedTask }),
    })
    .then(response => response.json())
    .then(savedTask => {
      const newTasks = { ...tasks, [savedTask.id]: savedTask };
      setTasks(newTasks);
      setShowModal(false);
      setCurrentTask(null);
    })
    .catch(error => console.error('Error updating task:', error));
  };

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="board grid grid-cols-3 gap-4">
    {Object.values(columns).map(column => (
      <Column
      key={column.id}
      column={column}
      tasks={column.taskIds.map(taskId => tasks[taskId])}
      handleDelete={handleDelete}
      handleAddTask={handleAddTask}
      handleEditClick={handleEditClick}
      />
      ))}
    </div>
    </DragDropContext>
    <Modal show={showModal} onClose={handleCloseModal}>
    {currentTask && <EditTaskForm task={currentTask} onSave={handleSaveTask} />}
    </Modal>
    </>
    );
};

export default Board;
