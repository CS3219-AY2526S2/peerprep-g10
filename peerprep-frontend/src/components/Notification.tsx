import React, { ReactNode } from 'react';
import { Info, Check, AlertCircle, Ban, X } from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type RightActionType = 'close' | 'spinner' | 'none';

export interface NotificationAction {
  label: string;
  variant: 'outlined' | 'filled';
  onClick: () => void;
}

export interface NotificationProps {
  type?: NotificationType;
  title: string;
  message?: ReactNode;
  rightAction?: RightActionType;
  onClose?: () => void;
  actionButton?: NotificationAction;
  className?: string;
}

export default function Notification({
  type = 'info',
  title,
  message,
  rightAction = 'close',
  onClose,
  actionButton,
  className = '',
}: NotificationProps) {
  
  const styleConfig = {
    info: {
      container: 'bg-[#F0F5FF] border-primary',
      icon: <Info className="text-primary" size={24} strokeWidth={2.5} />,
      spinner: 'border-primary border-r-transparent',
    },
    success: {
      container: 'bg-[#ECFDF5] border-green-600',
      icon: <Check className="text-green-600" size={26} strokeWidth={3} />,
      spinner: 'border-green-600 border-r-transparent',
    },
    warning: {
      container: 'bg-[#FFFBEB] border-yellow-500',
      icon: <AlertCircle className="text-yellow-500" size={24} strokeWidth={2.5} />,
      spinner: 'border-yellow-500 border-r-transparent',
    },
    error: {
      container: 'bg-[#FEF2F2] border-red-600',
      icon: <Ban className="text-red-600" size={24} strokeWidth={2.5} />,
      spinner: 'border-red-600 border-r-transparent',
    },
  };

  const config = styleConfig[type];

  return (
    <div 
      className={`w-full max-w-[480px] border-l-4 shadow-md rounded-r-sm p-5 flex gap-4 ${config.container} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {config.icon}
      </div>

      <div className="flex-grow flex flex-col pt-0.5">
        <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        
        {message && (
          <div className="text-[15px] text-gray-700 mt-1 leading-relaxed">
            {message}
          </div>
        )}

        {actionButton && (
          <div className="mt-4">
            <button
              onClick={actionButton.onClick}
              className={`cursor-pointer px-6 py-2 font-semibold text-[15px] transition-colors ${
                actionButton.variant === 'outlined'
                  ? 'border-2 border-primary text-primary bg-transparent'
                  : 'bg-primary text-white hover:bg-primary/90 border-2 border-primary'
              }`}
            >
              {actionButton.label}
            </button>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 ml-4">
        {rightAction === 'close' && (
          <button 
            onClick={onClose} 
            className="text-gray-800 hover:text-black opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        )}

        {rightAction === 'spinner' && (
          <div 
            className={`w-6 h-6 rounded-full border-[3px] animate-spin ${config.spinner}`} 
          />
        )}
      </div>
    </div>
  );
}
