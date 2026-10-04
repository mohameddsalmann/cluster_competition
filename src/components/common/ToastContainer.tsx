import React from 'react';
import { useDemoData } from '../../context/DemoDataContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDemoData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-[calc(100vw-32px)] pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-white border-blue-500 text-slate-800';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          bgClass = 'bg-white border-emerald-500 text-slate-800';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-white border-amber-500 text-slate-800';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (toast.type === 'error') {
          bgClass = 'bg-white border-rose-500 text-slate-800';
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto border-l-4 shadow-xl rounded-r-lg p-3 bg-white flex items-start gap-3 transition-all duration-300 transform translate-y-0 border-t border-r border-b border-slate-200`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
