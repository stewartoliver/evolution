import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["subtasksContainer", "checklistContainer"]

    connect() {
        this.setupDragAndDrop()
    }

    setupDragAndDrop() {
        // Initialize drag and drop for subtasks and checklist items
        const containers = [this.subtasksContainerTarget, this.checklistContainerTarget]
        containers.forEach(container => {
            new Sortable(container, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => this.handleReorder(evt)
            })
        })
    }

    async handleReorder(evt) {
        const item = evt.item
        const container = evt.to
        const newPosition = Array.from(container.children).indexOf(item)

        const type = container.id === 'subtasks-container' ? 'subtask' : 'checklist-item'
        const id = item.dataset[`${type}Id`]

        try {
            const response = await fetch(`/objectives/tasks/${id}/reorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ position: newPosition })
            })

            if (!response.ok) throw new Error('Failed to reorder')
        } catch (error) {
            console.error('Error reordering:', error)
        }
    }

    async addSubtask(event) {
        event.preventDefault()

        try {
            const response = await fetch('/objectives/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    task: {
                        title: 'New Subtask',
                        parent_task_id: this.element.dataset.taskId,
                        status: 'todo',
                        user_id: document.querySelector('meta[name="user-id"]').content
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to create subtask')

            const subtask = await response.json()
            const template = this.createSubtaskTemplate(subtask)
            this.subtasksContainerTarget.insertAdjacentHTML('beforeend', template)
        } catch (error) {
            console.error('Error creating subtask:', error)
        }
    }

    async addChecklistItem(event) {
        event.preventDefault()

        try {
            const response = await fetch(`/objectives/tasks/${this.element.dataset.taskId}/checklist_items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    checklist_item: {
                        title: 'New Item',
                        completed: false
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to create checklist item')

            const item = await response.json()
            const template = this.createChecklistItemTemplate(item)
            this.checklistContainerTarget.insertAdjacentHTML('beforeend', template)
        } catch (error) {
            console.error('Error creating checklist item:', error)
        }
    }

    async toggleSubtask(event) {
        const subtaskId = event.target.dataset.subtaskId
        const completed = event.target.checked

        try {
            const response = await fetch(`/objectives/tasks/${subtaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    task: {
                        status: completed ? 'done' : 'todo'
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to update subtask')

            const titleElement = event.target.closest('.subtask').querySelector('.subtask-title')
            titleElement.classList.toggle('line-through', completed)
            titleElement.classList.toggle('text-gray-500', completed)
        } catch (error) {
            console.error('Error updating subtask:', error)
            event.target.checked = !completed
        }
    }

    async toggleChecklistItem(event) {
        const itemId = event.target.dataset.checklistItemId
        const completed = event.target.checked

        try {
            const response = await fetch(`/objectives/tasks/${this.element.dataset.taskId}/checklist_items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    checklist_item: {
                        completed: completed
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to update checklist item')

            const titleElement = event.target.closest('.checklist-item').querySelector('.checklist-item-title')
            titleElement.classList.toggle('line-through', completed)
            titleElement.classList.toggle('text-gray-500', completed)
        } catch (error) {
            console.error('Error updating checklist item:', error)
            event.target.checked = !completed
        }
    }

    async updateSubtask(event) {
        const subtaskId = event.target.dataset.subtaskId
        const title = event.target.value

        try {
            const response = await fetch(`/objectives/tasks/${subtaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    task: {
                        title: title
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to update subtask')
        } catch (error) {
            console.error('Error updating subtask:', error)
        }
    }

    async updateChecklistItem(event) {
        const itemId = event.target.dataset.checklistItemId
        const title = event.target.value

        try {
            const response = await fetch(`/objectives/tasks/${this.element.dataset.taskId}/checklist_items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    checklist_item: {
                        title: title
                    }
                })
            })

            if (!response.ok) throw new Error('Failed to update checklist item')
        } catch (error) {
            console.error('Error updating checklist item:', error)
        }
    }

    async removeSubtask(event) {
        const subtaskId = event.target.dataset.subtaskId

        try {
            const response = await fetch(`/objectives/tasks/${subtaskId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                }
            })

            if (!response.ok) throw new Error('Failed to delete subtask')

            event.target.closest('.subtask').remove()
        } catch (error) {
            console.error('Error deleting subtask:', error)
        }
    }

    async removeChecklistItem(event) {
        const itemId = event.target.dataset.checklistItemId

        try {
            const response = await fetch(`/objectives/tasks/${this.element.dataset.taskId}/checklist_items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                }
            })

            if (!response.ok) throw new Error('Failed to delete checklist item')

            event.target.closest('.checklist-item').remove()
        } catch (error) {
            console.error('Error deleting checklist item:', error)
        }
    }

    createSubtaskTemplate(subtask) {
        return `
      <div class="subtask flex items-center gap-2 py-1" data-subtask-id="${subtask.id}">
        <div class="flex items-center gap-2 flex-1">
          <input type="checkbox" 
                 name="task[subtasks_attributes][${subtask.id}][status]"
                 class="subtask-status h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                 data-action="change->task#toggleSubtask"
                 data-subtask-id="${subtask.id}">
          
          <div class="flex-1">
            <input type="text"
                   name="task[subtasks_attributes][${subtask.id}][title]"
                   value="${subtask.title}"
                   class="subtask-title w-full bg-transparent border-none focus:ring-0"
                   data-action="blur->task#updateSubtask"
                   data-subtask-id="${subtask.id}">
          </div>
        </div>

        <button type="button" 
                class="text-gray-400 hover:text-red-500"
                data-action="click->task#removeSubtask"
                data-subtask-id="${subtask.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `
    }

    createChecklistItemTemplate(item) {
        return `
      <div class="checklist-item flex items-center gap-2 py-1" data-checklist-item-id="${item.id}">
        <div class="flex items-center gap-2 flex-1">
          <input type="checkbox"
                 name="task[checklist_items_attributes][${item.id}][completed]"
                 class="checklist-item-completed h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                 data-action="change->task#toggleChecklistItem"
                 data-checklist-item-id="${item.id}">
          
          <div class="flex-1">
            <input type="text"
                   name="task[checklist_items_attributes][${item.id}][title]"
                   value="${item.title}"
                   class="checklist-item-title w-full bg-transparent border-none focus:ring-0"
                   data-action="blur->task#updateChecklistItem"
                   data-checklist-item-id="${item.id}">
          </div>
        </div>

        <button type="button" 
                class="text-gray-400 hover:text-red-500"
                data-action="click->task#removeChecklistItem"
                data-checklist-item-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `
    }
} 