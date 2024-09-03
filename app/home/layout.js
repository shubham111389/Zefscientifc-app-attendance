import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="employees" />
      <Stack.Screen name="Job_Register_report" />
      <Stack.Screen name="Mark_job_register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name= "Login/Login_form" />
      <Stack.Screen name= "Login/LoginScreen" />
      <Stack.Screen name= "SignupScreen" />
      <Stack.Screen name="home/index" />
      <Stack.Screen name="home/login/login_form" />

    </Stack>
  );
}