import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const useRegionData = () => {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegionData = async () => {
      setLoading(true);
      try {
        const collectionRef = collection(db,"region ");
        const querySnapshot = await getDocs(collectionRef);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRegionData(data);
        console.log( regionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, []);

  return { regionData, loading, error };
};

export default useRegionData;