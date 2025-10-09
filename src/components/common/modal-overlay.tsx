import React, { useState, useEffect } from "react"

interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  closeOnOverlayClick?: boolean
  className?: string
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ 
  isOpen, 
  onClose, 
  children,
  closeOnOverlayClick = true,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300 p-4 ${isOpen ? "opacity-100" : "opacity-0"} ${className}`}
      onClick={handleOverlayClick}
    >
      <div className={`transform transition-all duration-300 w-full max-w-4xl ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        {children}
      </div>
    </div>
  )
}

export default ModalOverlay