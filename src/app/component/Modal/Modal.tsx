"use client";

import { X } from "lucide-react";
import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal = ({ isOpen, onClose, title, children, size = "md" }: ModalProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto modal-overlay" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur effect */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-all" onClick={onClose} aria-hidden="true"></div>

      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        {/* Modal panel */}
        <div className={`relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-full ${sizeClasses[size]} w-full modal-content`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
              {title}
            </h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" type="button">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
