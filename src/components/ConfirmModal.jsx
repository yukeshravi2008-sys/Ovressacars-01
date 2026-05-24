import { useEffect } from 'react'
import { MdWarning, MdError } from 'react-icons/md'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-border-light rounded-2xl p-6 max-w-sm w-full animate-fade-in shadow-lg-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          {confirmVariant === 'danger' ? (
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <MdError size={32} className="text-danger" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <MdWarning size={32} className="text-yellow-600" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-text-primary text-center mb-2">{title}</h3>
        <p className="text-sm text-text-secondary text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary border border-border-light rounded-xl hover:bg-bg-section transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${
              confirmVariant === 'danger'
                ? 'bg-danger hover:bg-red-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
