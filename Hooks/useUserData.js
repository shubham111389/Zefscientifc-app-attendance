import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserData = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserDataFromFirestore = async (uid) => {
      try {
        const docRef = doc(db, "Users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails({
            ...userData,
            uid, // Add uid to the user details object
          });
          // Store user data in AsyncStorage
          await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
        } else {
          setError("No such document!");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch user data from AsyncStorage
    const fetchUserDataFromAsyncStorage = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('@user_data');
        if (storedUserData) {
          setUserDetails(JSON.parse(storedUserData));
        } else {
          setError("No user data found in AsyncStorage.");
          setLoading(false); // Stop loading if no data is found
        }
      } catch (err) {
        setError(err.message);
        setLoading(false); // Stop loading on error
      }
    };

    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserDataFromFirestore(user.uid);
      } else {
        await fetchUserDataFromAsyncStorage();
        setError("User is not logged in");
      }
    });

    // Cleanup function to remove the listener
    return () => unsubscribe();

  }, []); 

  return { userDetails, loading, error };
};

export default useUserData;
