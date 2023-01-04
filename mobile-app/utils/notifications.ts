import Toast from 'react-native-root-toast';

export const notificationMessage = (msg: string, color: string, duration: number) => {
  const bottomOffset = -100;

  Toast.show(msg, {
    backgroundColor: color,
    duration: duration,
    position: bottomOffset,
    animation: true,
  });
};