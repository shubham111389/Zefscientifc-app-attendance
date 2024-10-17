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

/*const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];*/