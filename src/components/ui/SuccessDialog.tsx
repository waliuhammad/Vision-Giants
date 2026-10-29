import { useEffect, useRef, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  /** Extra actions shown beside the Close button. */
  actions?: ReactNode;
}

/**
 * Confirmation pop-up shown after a form is sent. Uses the native <dialog> (focus trap, Escape to
 * close, page behind it inert); clicking the backdrop also closes it.
 */
export function SuccessDialog({ open, title, children, onClose, actions }: SuccessDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal success-dialog"
      aria-labelledby="success-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
        <X size={18} />
      </button>
      <div className="success-dialog__body">
        <span className="success-dialog__icon" aria-hidden="true">
          <Check size={28} strokeWidth={2.5} />
        </span>
        <h2 id="success-dialog-title">{title}</h2>
        <div className="success-dialog__text">{children}</div>
        <div className="success-dialog__actions">
          <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>
            Done
          </button>
          {actions}
        </div>
      </div>
    </dialog>
  );
}
