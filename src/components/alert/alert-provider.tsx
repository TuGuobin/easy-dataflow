import React, { useState, useEffect } from "react"
import AlertPrompt, { type AlertOptions } from "./alert-prompt"
import { alertManager } from "../../utils/alert"

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AlertOptions>({ message: "" })

  useEffect(() => {
    const handleAlert = (alertOptions: AlertOptions) => {
      setOptions(alertOptions)
      setIsOpen(true)
    }

    alertManager.subscribe(handleAlert)

    return () => {
      alertManager.unsubscribe(handleAlert)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {children}
      <AlertPrompt 
        isOpen={isOpen} 
        onClose={handleClose} 
        options={options} 
      />
    </>
  )
}