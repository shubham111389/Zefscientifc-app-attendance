import React, { createContext, useContext } from "react";
import useUserData from "../../Hooks/useUserData";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { userDetails, loading, error } = useUserData();

  return (
    <UserContext.Provider value={{ userDetails, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);