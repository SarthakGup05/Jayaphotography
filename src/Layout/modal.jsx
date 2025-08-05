// components/ui/modal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ---------------------------------------------------------
   Reusable Modal component
--------------------------------------------------------- */
export const Modal = ({
  open,                 // controlled open state (optional)
  onOpenChange,         // controlled setter     (optional)
  trigger,              // trigger element
  title,
  description,
  children,             // can be ReactNode or function ⇐ NEW
  footer,
  className,
  ...props
}) => {
  /* ── internal state when uncontrolled ── */
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled   = typeof open === "boolean";
  const isOpen       = controlled ? open : internalOpen;
  const setOpen      = controlled ? onOpenChange : setInternalOpen;

  /* Helper given to children so they can close the modal */
  const close = () => setOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} {...props}>
      {/* Trigger */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title       && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* Body */}
        <div className="py-4">
          {typeof children === "function" ? children({ close }) : children}
        </div>

        {/* Optional footer */}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
