type ConfirmationModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  context: string
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  context
}: ConfirmationModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-4">
          Are you sure you want to {context}
        </h2>

        <p className="text-2xl  mb-6 font-bold wrap-break-word">
          {title}
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {context}
          </button>
        </div>
      </div>
    </div>
  )
}