import React from "react";
import { UserProvider } from "./UserContext";
import YourAppComponents from "./YourAppComponents";

export default function App() {
  return (
    <UserProvider>
      <YourAppComponents />
    </UserProvider>
  );
}