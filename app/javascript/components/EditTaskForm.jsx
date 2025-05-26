import React, { useState, useEffect } from "react";
import ConfirmationModal from './ConfirmationModal';

const EditTaskForm = ({ task, onSave }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "todo");
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [priority, setPriority] = useState(task.priority || "");
  const [assignedTo, setAssignedTo] = useState(task.assigned_to || "");
  const [tags, setTags] = useState(task.tags || "");
  const [checklists, setChecklists] = useState([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);

  useEffect(() => {
    loadTaskData();
  }, [task.id]);

  const loadTaskData = async () => {
    try {
      console.log('Loading task data for task:', task.id);
      const response = await fetch(`/objectives/tasks/${task.id}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }
      const taskData = await response.json();
      console.log('Loaded task data:', taskData);
      
      // Update form fields
      setTitle(taskData.title || "");
      setDescription(taskData.description || "");
      setStatus(taskData.status || "todo");
      setDueDate(taskData.due_date || "");
      setPriority(taskData.priority || "");
      setAssignedTo(taskData.assigned_to || "");
      setTags(taskData.tags || "");
      
      // Handle checklists
      if (taskData.checklists && Array.isArray(taskData.checklists)) {
        console.log('Processing checklists:', taskData.checklists);
        const formattedChecklists = taskData.checklists.map(checklist => ({
          id: checklist.id,
          title: checklist.title,
          items: Array.isArray(checklist.checklist_items) ? checklist.checklist_items : []
        }));
        console.log('Formatted checklists:', formattedChecklists);
        setChecklists(formattedChecklists);
        setShowChecklist(true);
      } else {
        console.log('No checklists found in task data');
        setChecklists([]);
        setShowChecklist(false);
      }
    } catch (error) {
      console.error('Error loading task data:', error);
      setChecklists([]);
      setShowChecklist(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedTask = {
      ...task,
      title,
      description,
      status,
      due_date: dueDate,
      priority,
      assigned_to: assignedTo,
      tags,
      checklists_attributes: checklists.map(checklist => ({
        id: checklist.id,
        title: checklist.title,
        _destroy: checklist._destroy,
        checklist_items_attributes: checklist.items.map(item => ({
          id: item.id,
          text: item.text,
          completed: item.completed,
          _destroy: item._destroy
        }))
      }))
    };
    onSave(updatedTask);
  };

  const addChecklist = async (e) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      try {
        const response = await fetch(`/objectives/tasks/${task.id}/checklists.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({
            checklist: {
              title: newChecklistTitle
            }
          })
        });

        if (response.ok) {
          const newChecklist = await response.json();
          console.log('New checklist created:', newChecklist);
          setChecklists(prevChecklists => [...prevChecklists, {
            id: newChecklist.id,
            title: newChecklist.title,
            items: newChecklist.checklist_items || []
          }]);
          setNewChecklistTitle("");
          setIsAddingChecklist(false);
          setShowChecklist(true);
        } else {
          const errorData = await response.json();
          console.error('Failed to create checklist:', errorData);
        }
      } catch (error) {
        console.error('Error creating checklist:', error);
      }
    }
  };

  const addChecklistItem = async (checklistId, e) => {
    e.preventDefault();
    if (newChecklistItem.trim()) {
      try {
        const response = await fetch(`/objectives/tasks/${task.id}/checklists/${checklistId}/checklist_items.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({
            checklist_item: {
              text: newChecklistItem.trim(),
              completed: false,
              position: checklists.find(c => c.id === checklistId)?.items.length || 0
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to create checklist item:', errorData);
          throw new Error(errorData.error || errorData.errors || 'Failed to create checklist item');
        }

        const newItem = await response.json();
        console.log('New checklist item created:', newItem);
        setChecklists(prevChecklists => prevChecklists.map(checklist => 
          checklist.id === checklistId 
            ? { 
                ...checklist, 
                items: [...checklist.items, newItem]
              }
            : checklist
        ));
        setNewChecklistItem("");
      } catch (error) {
        console.error('Error creating checklist item:', error);
        // You might want to show an error notification to the user here
      }
    }
  };

  const toggleChecklistItem = async (checklistId, itemId) => {
    const checklist = checklists.find(c => c.id === checklistId);
    const item = checklist.items.find(i => i.id === itemId);
    const newCompleted = !item.completed;

    try {
      const response = await fetch(`/objectives/tasks/${task.id}/checklists/${checklistId}/checklist_items/${itemId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          checklist_item: {
            completed: newCompleted
          }
        })
      });

      if (response.ok) {
        setChecklists(checklists.map(checklist => 
          checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.map(item =>
                  item.id === itemId ? { ...item, completed: newCompleted } : item
                )
              }
            : checklist
        ));
      } else {
        console.error('Failed to update checklist item');
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const deleteChecklistItem = async (checklistId, itemId) => {
    try {
      const response = await fetch(`/objectives/tasks/${task.id}/checklists/${checklistId}/checklist_items/${itemId}.json`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });

      if (response.ok) {
        setChecklists(checklists.map(checklist =>
          checklist.id === checklistId
            ? { 
                ...checklist, 
                items: checklist.items.filter(item => item.id !== itemId)
              }
            : checklist
        ));
      } else {
        console.error('Failed to delete checklist item');
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };

  const handleDeleteChecklist = (checklistId) => {
    setChecklistToDelete(checklistId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChecklist = async () => {
    if (checklistToDelete) {
      try {
        const response = await fetch(`/objectives/tasks/${task.id}/checklists/${checklistToDelete}.json`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          }
        });

        if (response.ok) {
          setChecklists(checklists.filter(checklist => checklist.id !== checklistToDelete));
        } else {
          console.error('Failed to delete checklist');
        }
      } catch (error) {
        console.error('Error deleting checklist:', error);
      }
      setShowDeleteConfirm(false);
      setChecklistToDelete(null);
    }
  };

  const updateChecklistTitle = async (checklistId, newTitle) => {
    try {
      const response = await fetch(`/objectives/tasks/${task.id}/checklists/${checklistId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          checklist: {
            title: newTitle
          }
        })
      });

      if (response.ok) {
        setChecklists(checklists.map(checklist =>
          checklist.id === checklistId
            ? { ...checklist, title: newTitle }
            : checklist
        ));
      } else {
        console.error('Failed to update checklist title');
      }
    } catch (error) {
      console.error('Error updating checklist title:', error);
    }
  };

  const inputClass = "rounded-md border bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark font-medium text-sm focus:ring-0 w-full";

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold text-text-light dark:text-text-dark border-x-0 border-t-0 border-b-2 border-background-input-light dark:border-background-input-dark focus:border-primary-500 focus:dark:border-primary-500 focus:border-b-2 focus:ring-0 focus:outline-none bg-transparent w-full"
          placeholder="Task Title"
        />

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-light dark:text-text-dark">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Add a more detailed description..."
          />
        </div>

        {/* Checklists Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium text-text-light dark:text-text-dark">Checklists</h3>
          
          {isAddingChecklist && (
            <div className="bg-background-card-light dark:bg-background-card-dark rounded-md p-4">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Enter checklist title..."
                  className={inputClass}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addChecklist}
                    className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition"
                  >
                    Create Checklist
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingChecklist(false);
                      setNewChecklistTitle("");
                    }}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showChecklist && checklists.length > 0 ? (
            checklists.map((checklist) => (
              <div key={checklist.id} className="bg-background-card-light dark:bg-background-card-dark rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={checklist.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setChecklists(checklists.map(c =>
                        c.id === checklist.id ? { ...c, title: newTitle } : c
                      ));
                    }}
                    onBlur={() => updateChecklistTitle(checklist.id, checklist.title)}
                    className="font-medium text-lg bg-transparent border-0 focus:ring-0 focus:border-b-2 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteChecklist(checklist.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete Checklist
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {checklist.items && checklist.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(checklist.id, item.id)}
                        className="rounded-sm border-0 focus:border-0 shadow-sm focus:ring-0 text-primary-500"
                      />
                      <span className={`flex-grow ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteChecklistItem(checklist.id, item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addChecklistItem(checklist.id, e);
                        }
                      }}
                      placeholder="Add an item..."
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={(e) => addChecklistItem(checklist.id, e)}
                      className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No checklists yet. Click "Add New Checklist" to create one.</div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-light dark:text-text-dark">
            Status
          </label>
          <div className="relative w-full">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${inputClass} pl-10 w-full`}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} absolute left-3 top-1/2 transform -translate-y-1/2`} />
          </div>
        </div>

        {/* Add Checklist Button */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-light dark:text-text-dark">
            Checklists
          </label>
          <button
            type="button"
            onClick={() => setIsAddingChecklist(true)}
            className={`${inputClass} pl-10 w-full text-left flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Checklist
          </button>
        </div>

        {/* Task Details */}
        <div className="flex flex-col gap-4 bg-background-card-light dark:bg-background-card-dark rounded-md p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">
              Due Date
            </label>
            <div className="relative w-full">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${inputClass} pl-10 w-full`}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">
              Priority
            </label>
            <div className="relative w-full">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`${inputClass} pl-10 w-full`}
              >
                <option value="">Select Priority</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Urgent</option>
                <option value="5">Critical</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">
              Assigned To
            </label>
            <div className="relative w-full">
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={`${inputClass} pl-10 w-full`}
                placeholder="Assign to..."
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-light dark:text-text-dark">
              Tags
            </label>
            <div className="relative w-full">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={`${inputClass} pl-10 w-full`}
                placeholder="Add tags..."
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteChecklist}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default EditTaskForm;
