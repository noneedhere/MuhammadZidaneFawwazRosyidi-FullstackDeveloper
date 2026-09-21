interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary', onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fade-in">
        <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">{title}</h3>
        <p className="text-sm text-[#434655] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-[#c3c6d7] text-[#434655] hover:bg-[#f8f9ff] transition-colors">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
              variant === 'danger' ? 'bg-[#ba1a1a] hover:bg-[#93000a]' : 'bg-[#2563eb] hover:bg-[#004ac6]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
