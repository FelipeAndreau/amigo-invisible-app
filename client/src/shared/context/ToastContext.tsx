import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  show: () => {},
  showError: () => {},
  showSuccess: () => {},
  showInfo: () => {},
  showWarning: () => {},
});

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${++toastIdCounter}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const showError = useCallback((message: string) => show(message, 'error'), [show]);
  const showSuccess = useCallback((message: string) => show(message, 'success'), [show]);
  const showInfo = useCallback((message: string) => show(message, 'info'), [show]);
  const showWarning = useCallback((message: string) => show(message, 'warning'), [show]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, showError, showSuccess, showInfo, showWarning }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);