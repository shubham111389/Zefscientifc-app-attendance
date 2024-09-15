import { Alert } from 'react-native';

export const showCustomAlert = (title, message, buttons) => {
  Alert.alert(
    title || 'Alert', 
    message || 'Something went wrong', 
    buttons || [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ],
    { cancelable: true }
  );
};
