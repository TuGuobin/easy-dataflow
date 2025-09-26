import { AlertManager, type AlertType } from "../components/alert/alert-prompt"

export const alertManager = AlertManager.getInstance()

export const showAlert = (message: string, title?: string, type: AlertType = "info") => {
  alertManager.show({ message, title, type })
}

export const showSuccess = (message: string, title?: string) => {
  alertManager.show({ message, title, type: "success" })
}

export const showWarning = (message: string, title?: string) => {
  alertManager.show({ message, title, type: "warning" })
}

export const showError = (message: string, title?: string) => {
  alertManager.show({ message, title, type: "error" })
}

export const showConfirm = (message: string, onConfirm?: () => void, title?: string, onCancel?: () => void) => {
  if (onConfirm) {
    alertManager.show({
      message,
      title,
      type: "confirm",
      onConfirm,
      onCancel,
    })
  } else {
    return alertManager.showConfirm(message, title)
  }
}
