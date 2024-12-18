import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom hook to get user data from AsyncStorage
const useUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await AsyncStorage.getItem('@user_data');
                if (data) {
                    setUserData(JSON.parse(data));
                } else {
                    console.log('No user data found in AsyncStorage');
                }
            } catch (err) {
                console.log('Error fetching user data from AsyncStorage:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    return { userData, loading, error };
};

export default useUser;
