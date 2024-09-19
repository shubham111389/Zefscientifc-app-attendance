import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path to your config

export const updateUserDataInFirestore = async (uid, updatedFields) => {
  try {
    const userRef = doc(db, 'users', uid);
    // This will only update the specified fields
    await updateDoc(userRef, updatedFields);
  } catch (error) {
    console.error('Error updating Firestore:', error);
    throw error;
  }
};
