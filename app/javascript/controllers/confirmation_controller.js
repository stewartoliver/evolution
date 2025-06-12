import { Controller } from "@hotwired/stimulus"
import { createRoot } from "react-dom/client"
import ConfirmationModal from "../components/ConfirmationModal"

export default class extends Controller {
    static targets = ["trigger"]

    connect() {
        this.triggerTarget.addEventListener("click", this.handleClick.bind(this))
    }

    disconnect() {
        this.triggerTarget.removeEventListener("click", this.handleClick.bind(this))
    }

    handleClick(event) {
        event.preventDefault()
        event.stopPropagation()

        const container = document.createElement("div")
        const root = createRoot(container)
        document.body.appendChild(container)

        const handleConfirm = () => {
            root.unmount()
            container.remove()
            this.triggerTarget.click()
        }

        const handleClose = () => {
            root.unmount()
            container.remove()
        }

        root.render(
            <ConfirmationModal
                isOpen={true}
                onClose={handleClose}
                onConfirm={handleConfirm}
                type={this.triggerTarget.dataset.confirmationType || "confirm"}
                confirmText={this.triggerTarget.dataset.confirmationConfirmText || "Confirm"}
                cancelText={this.triggerTarget.dataset.confirmationCancelText || "Cancel"}
                anchorRef={this.triggerTarget}
            />
        )
    }
} 