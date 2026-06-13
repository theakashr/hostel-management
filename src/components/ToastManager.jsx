import React from 'react';
import useStore from '../store/useStore';

const ToastManager = () => {
  const toasts = useStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium min-w-[250px] animate-slide-up ${
            toast.type === 'success' ? 'bg-accent-green' :
            toast.type === 'error' ? 'bg-alert-red' :
            'bg-primary-blue'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastManager;
