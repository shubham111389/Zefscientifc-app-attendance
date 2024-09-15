import React from 'react';
 // Ensure the correct path to your store
import { Stack } from 'expo-router';


const AppLayout = () => {
  return (
    
      <Stack  screenOptions={{ headerShown: false }}>
     
        <Stack.Screen name="Login_page" />
        <Stack.Screen name="Login_form" />
        {/* Add other screens as necessary */}
      </Stack>
    
  );
}

export default AppLayout;