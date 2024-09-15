import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useOnline = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    // Cleanup the event listener
    return () => unsubscribe();
  }, []);

  return isOnline;
};

export default useOnline;
