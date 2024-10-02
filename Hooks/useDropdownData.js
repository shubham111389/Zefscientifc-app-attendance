import { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure you have firebase config set up
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDropdownData = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch dropdown data from Firestore
  const fetchDropdownDataFromFirestore = async () => {
    try {
      const dropdownCollection = collection(db, "Dropdown");
      const querySnapshot = await getDocs(dropdownCollection);

      const options = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDropdownOptions(options);

      // Store the dropdown data in AsyncStorage for offline access
      await AsyncStorage.setItem('@dropdown_data', JSON.stringify(options));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data from AsyncStorage
  const fetchDropdownDataFromAsyncStorage = async () => {
    try {
      const storedDropdownData = await AsyncStorage.getItem('@dropdown_data');
      if (storedDropdownData) {
        setDropdownOptions(JSON.parse(storedDropdownData));
      } else {
        setError("No dropdown data found in AsyncStorage.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        await fetchDropdownDataFromFirestore();
      } catch (err) {
        await fetchDropdownDataFromAsyncStorage();
      }
    };

    loadDropdownData();
    console.log(dropdownOptions);

  }, []);

  return { dropdownOptions, loading, error };
};

export default useDropdownData;
