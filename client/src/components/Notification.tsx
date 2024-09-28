import React from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  visible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose, visible }) => {
  if (!visible) return null;

  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
