import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const createNotification = (type, msg, duration = 6000) => {
  if (type === 'success')
    NotificationManager.success(msg, "Success", duration);
  else if (type === 'error')
      NotificationManager.error(msg, "Sorry but...", duration);
  else if (type === 'info')
      NotificationManager.info(msg, "Info", duration);
  else if (type === 'warning')
      NotificationManager.warning(msg, "Attention please...", duration);
};

export default createNotification;