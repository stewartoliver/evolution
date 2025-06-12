import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, Trash2, Eye, CheckCircle } from 'lucide-react';

export function SortableChore({ chore, onComplete, onRemove, assignedUser, users, onAssignUser }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: chore.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
    >
      {/* Drag Handle */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        {chore.in_current_rotation && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            chore.rotation_completed 
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
          }`}>
            {chore.rotation_completed ? 'Completed' : 'Current Rotation'}
          </span>
        )}
      </td>

      {/* Title */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-text-light dark:text-text-dark">
            {chore.name}
          </div>
          <div className="text-sm text-text-sub dark:text-text-sub-dark">
            {chore.description || 'No description'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
              {chore.category || 'Uncategorized'}
            </span>
            {chore.estimated_minutes && (
              <span className="text-xs text-text-sub dark:text-text-sub-dark">
                {chore.estimated_minutes} min
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Assigned To */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-text-light dark:text-text-dark bg-background-input-light dark:bg-background-input-dark rounded-md hover:bg-background-hover dark:hover:bg-background-hover-dark transition-colors"
          >
            {assignedUser ? (
              <>
                <span>{assignedUser.name}</span>
                {assignedUser.email && (
                  <span className="text-xs text-text-sub dark:text-text-sub-dark">
                    ({assignedUser.email})
                  </span>
                )}
                <ChevronDown className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Assign User</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {showUserDropdown && (
            <div className="absolute z-10 mt-1 w-48 bg-background-card dark:bg-background-card-dark rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onAssignUser(user.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        assignedUser?.id === user.id
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'text-text-light dark:text-text-dark hover:bg-background-hover dark:hover:bg-background-hover-dark'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        {user.email && (
                          <span className="text-xs text-text-sub dark:text-text-sub-dark">
                            {user.email}
                          </span>
                        )}
                        {user.user_id && (
                          <span className="text-xs text-text-sub dark:text-text-sub-dark">
                            Position {user.position}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-text-sub dark:text-text-sub-dark">
                    No users available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-4">
          <a
            href={`/objectives/chores/${chore.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline hover:opacity-80 transition-opacity"
            title="View Chore"
          >
            <Eye className="w-5 h-5" />
          </a>
          {chore.in_current_rotation && (
            <button
              onClick={() => onComplete(chore.id)}
              className={`text-green-600 dark:text-green-400 hover:underline flex items-center hover:opacity-80 transition-opacity ${
                chore.rotation_completed ? 'opacity-50' : ''
              }`}
              title={chore.rotation_completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onRemove(chore.id)}
            className="text-red-600 dark:text-red-400 hover:underline flex items-center hover:opacity-80 transition-opacity"
            title="Remove from List"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
} 