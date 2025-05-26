import { Application } from "@hotwired/stimulus"
import TaskController from "./controllers/task_controller"
import Sortable from "sortablejs"

// Initialize Stimulus
const application = Application.start()

// Register the task controller
application.register("task", TaskController)

// Make Sortable available globally
window.Sortable = Sortable 