import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableChore } from './SortableChore';
import ChoreSearch from './ChoreSearch';
import { Plus, Eye, CheckCircle, XCircle, GripVertical, Search, UserPlus, Trash2 } from 'lucide-react';

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in ChoreListTable:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</h3>
          <p className="text-red-600 dark:text-red-300">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const ChoreListTable = ({ choreChartId }) => {
  const queryClient = useQueryClient();
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChoreForm, setShowNewChoreForm] = useState(false);
  const [newChoreName, setNewChoreName] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch chores for this chart
  const { data: chartData, isLoading, error: queryError } = useQuery({
    queryKey: ['chores', choreChartId],
    queryFn: async () => {
      try {
        const response = await fetch(`/objectives/chore_charts/${choreChartId}/chores`, {
          headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Ensure users array exists and has at least the creator
        if (!data.users || data.users.length === 0) {
          console.warn('No users found in chore chart data');
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching chores:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Destructure the API response
  const { chores = [], rotation_status = {}, users = [] } = chartData || {};

  // Add chore mutation
  const addChoreMutation = useMutation({
    mutationFn: async (chore) => {
      console.log('Adding chore:', chore);
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/add_chore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ chore_id: chore.id })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      console.log('Chore added successfully');
      queryClient.invalidateQueries(['chores', choreChartId]);
    }
  });

  // Remove chore mutation
  const removeChoreMutation = useMutation({
    mutationFn: async (choreId) => {
      console.log('Removing chore:', choreId);
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/remove_chore`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ chore_id: choreId })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      console.log('Chore removed successfully');
      queryClient.invalidateQueries(['chores', choreChartId]);
    }
  });

  // Complete chore mutation
  const completeChoreMutation = useMutation({
    mutationFn: async (choreId) => {
      console.log('Completing chore:', choreId);
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/complete_chore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ chore_id: choreId })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      console.log('Chore completed successfully');
      queryClient.invalidateQueries(['chores', choreChartId]);
    }
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ choreId, newPosition }) => {
      console.log('Updating chore order:', { choreId, newPosition });
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ chore_ids: chores.map(c => c.id) })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      console.log('Order updated successfully');
      queryClient.invalidateQueries(['chores', choreChartId]);
    }
  });

  // Add new chore mutation
  const addNewChoreMutation = useMutation({
    mutationFn: async (choreData) => {
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/chores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(choreData)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chores', choreChartId]);
      setNewChoreName('');
      setShowNewChoreForm(false);
    }
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async ({ name, email, userId }) => {
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ name, email, user_id: userId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['choreChart', choreChartId]);
      setNewUserName('');
      setNewUserEmail('');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Update user position mutation
  const updateUserPositionMutation = useMutation({
    mutationFn: async ({ userId, newPosition }) => {
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/users/${userId}/position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ position: newPosition })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user position');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['choreChart', choreChartId]);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Remove user mutation
  const removeUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['choreChart', choreChartId]);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Assign user mutation
  const assignUserMutation = useMutation({
    mutationFn: async ({ choreId, userId }) => {
      const response = await fetch(`/objectives/chore_charts/${choreChartId}/chores/${choreId}/assign_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chores', choreChartId]);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = chores.findIndex((chore) => chore.id === active.id);
      const newIndex = chores.findIndex((chore) => chore.id === over.id);
      
      updateOrderMutation.mutate({
        choreId: active.id,
        newPosition: newIndex + 1
      });
    }
  };

  const handleChoreSelect = (chore) => {
    console.log('Selected chore:', chore);
    addChoreMutation.mutate(chore);
  };

  const handleRemoveChore = (choreId) => {
    if (window.confirm('Are you sure you want to remove this chore from the list?')) {
      removeChoreMutation.mutate(choreId);
    }
  };

  const handleCompleteChore = (choreId) => {
    completeChoreMutation.mutate(choreId);
  };

  const handleNewChoreSubmit = (e) => {
    e.preventDefault();
    if (newChoreName.trim()) {
      addNewChoreMutation.mutate({ name: newChoreName.trim() });
    }
  };

  const handleUserDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = users.findIndex((user) => user.id === active.id);
      const newIndex = users.findIndex((user) => user.id === over.id);
      
      updateUserPositionMutation.mutate({
        userId: active.id,
        newPosition: newIndex + 1
      });
    }
  };

  const handleRemoveUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user from the rotation?')) {
      removeUserMutation.mutate(userId);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    addUserMutation.mutate({ name: newUserName, email: newUserEmail });
  };

  const handleAssignUser = (choreId, userId) => {
    assignUserMutation.mutate({ choreId, userId });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.cancelQueries(['chores', choreChartId]);
    };
  }, [choreChartId, queryClient]);

  // Handle errors
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error</h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
        <button
          onClick={() => {
            setError(null);
            queryClient.invalidateQueries(['chores', choreChartId]);
          }}
          className="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading chores...</div>
      </div>
    );
  }

  // Calculate next rotation details
  const nextRotationDate = rotation_status.next_rotation_date ? new Date(rotation_status.next_rotation_date) : null;
  const daysUntilNextRotation = nextRotationDate ? Math.ceil((nextRotationDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  console.log('Rendering ChoreListTable with chores:', chores);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-4">
        {/* Rotation Status */}
        <div className="bg-background-card dark:bg-background-card-dark rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Rotation</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-primary-500 rounded hover:bg-primary-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Manage Users
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-background-input-light dark:bg-background-input-dark rounded-lg">
              <div className="text-sm font-medium text-text-sub dark:text-text-sub-dark">Current Rotation</div>
              <div className="mt-1 text-lg font-semibold text-text-light dark:text-text-dark">
                {rotation_status.current_rotation ?? 'Not set'}
              </div>
            </div>
            <div className="p-3 bg-background-input-light dark:bg-background-input-dark rounded-lg">
              <div className="text-sm font-medium text-text-sub dark:text-text-sub-dark">Next Rotation</div>
              <div className="mt-1 text-lg font-semibold text-text-light dark:text-text-dark">
                {nextRotationDate ? nextRotationDate.toLocaleDateString() : 'Not set'}
              </div>
              <div className="text-sm text-text-sub dark:text-text-sub-dark">
                {nextRotationDate ? nextRotationDate.toLocaleTimeString() : ''}
              </div>
            </div>
            <div className="p-3 bg-background-input-light dark:bg-background-input-dark rounded-lg">
              <div className="text-sm font-medium text-text-sub dark:text-text-sub-dark">Days Until Next Rotation</div>
              <div className="mt-1 text-lg font-semibold text-text-light dark:text-text-dark">
                {daysUntilNextRotation !== null ? `${daysUntilNextRotation} days` : 'Not set'}
              </div>
            </div>
          </div>

          {/* User Management Section */}
          {showUserManagement && (
            <div className="mt-4 p-4 bg-background-input-light dark:bg-background-input-dark rounded-lg">
              <h4 className="text-md font-semibold mb-4">Rotation Users</h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleUserDragEnd}
              >
                <SortableContext
                  items={users.map(user => user.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <span className="text-text-light dark:text-text-dark">{user.name}</span>
                            {user.email && (
                              <span className="text-sm text-text-sub dark:text-text-sub-dark ml-2">
                                ({user.email})
                              </span>
                            )}
                            {user.user_id && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                Registered User
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-text-sub dark:text-text-sub-dark">
                            Position {user.position}
                          </span>
                          {user.position !== 1 && (
                            <button
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-600 dark:text-red-400 hover:underline flex items-center hover:opacity-80 transition-opacity"
                              title="Remove User"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add User Form */}
              <form
                onSubmit={handleAddUser}
                className="space-y-4 mt-4"
              >
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email address (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Chores List */}
        <div className="bg-background-card dark:bg-background-card-dark rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chores</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-primary-500 rounded hover:bg-primary-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Add Existing Chore
                </button>
                <button
                  onClick={() => setShowNewChoreForm(!showNewChoreForm)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-primary-500 rounded hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Chore
                </button>
              </div>
            </div>
          </div>

          {/* Search Component */}
          {showSearch && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <ChoreSearch onSelectChore={handleChoreSelect} />
            </div>
          )}

          {/* New Chore Form */}
          {showNewChoreForm && (
            <form onSubmit={handleNewChoreSubmit} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <label htmlFor="newChoreName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                    Chore Name
                  </label>
                  <input
                    type="text"
                    id="newChoreName"
                    value={newChoreName}
                    onChange={(e) => setNewChoreName(e.target.value)}
                    placeholder="Enter chore name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background-input-light dark:bg-background-input-dark text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewChoreForm(false);
                      setNewChoreName('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Chores Table */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-background-card dark:bg-background-card-dark">
                  <tr>
                    <th className="w-10 px-4 py-3"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-light dark:text-text-dark uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background-light dark:bg-background-dark divide-y divide-gray-200 dark:divide-gray-700">
                  <SortableContext
                    items={chores.map(chore => chore.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {chores && chores.length > 0 ? (
                      chores.map((chore) => (
                        <SortableChore
                          key={chore.id}
                          chore={chore}
                          onComplete={() => handleCompleteChore(chore.id)}
                          onRemove={() => handleRemoveChore(chore.id)}
                          assignedUser={users.find(u => u.id === chore.assigned_user_id)}
                          users={users}
                          onAssignUser={(userId) => handleAssignUser(chore.id, userId)}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No chores in this list. Add some using the buttons above.
                        </td>
                      </tr>
                    )}
                  </SortableContext>
                </tbody>
              </table>
            </div>
          </DndContext>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChoreListTable; 