import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const useUserData = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              setUserDetails({
                ...docSnap.data(),
                uid: user.uid, // Add uid to the user details object
              });
            } else {
              setError("No such document!");
            }
          } else {
            setError("User is not logged in");
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // Call the fetch function inside useEffect
  }, []); // Empty dependency array ensures it runs once

  return { userDetails, loading, error };
};

export default useUserData;
