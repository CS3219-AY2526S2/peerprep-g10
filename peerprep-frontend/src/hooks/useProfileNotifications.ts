import { useState, useEffect } from 'react';
import { User } from '@/src/services/user/types';
import { NotificationProps } from '@/src/components/Notification';

type ActiveNotification = Omit<NotificationProps, 'onClose'>;

export function useProfileNotifications() {
  const [activeNotification, setActiveNotification] = useState<ActiveNotification | null>(null);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!activeNotification) return;
    const timer = setTimeout(() => setActiveNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [activeNotification]);

  const handleProfileSuccess = (updatedUser: User, emailChanged: boolean, setUser: (u: User) => void) => {
    setUser(updatedUser);
    if (emailChanged) {
      setActiveNotification({
        type: 'info',
        title: 'Verify your new email',
        message: 'A verification link has been sent to your new address. Please check your inbox.',
      });
    } else {
      setActiveNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your username has been saved successfully.',
      });
    }
  };

  const handlePasswordSuccess = () => {
    setActiveNotification({
      type: 'success',
      title: 'Password changed',
      message: 'Your password has been updated successfully.',
    });
  };

  const handleIconSuccess = (updatedUser: User, setUser: (u: User) => void) => {
    setUser(updatedUser);
    setActiveNotification({
      type: 'success',
      title: 'Avatar updated',
      message: 'Your new profile picture has been saved.',
    });
  };

  return {
    activeNotification,
    setActiveNotification,
    handleProfileSuccess,
    handlePasswordSuccess,
    handleIconSuccess,
  };
}