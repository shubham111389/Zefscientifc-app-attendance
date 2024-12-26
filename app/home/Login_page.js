import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

const Login_page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./../../assets/logo1.png')} // Replace with your logo's path
          style={styles.logo}
        />

        <Text style={styles.title}>ᴢᴇꜰ ꜱᴄɪᴇɴᴛɪꜰɪᴄ ɪɴᴅ ᴘᴠᴛ ʟᴛᴅ</Text>
        <Text style={styles.subtitle}>Verify your identity to get started ?</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("home/Login_form")}>
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Terms of Service - Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.copyrightText}>
          © 2024 ZEF SCIENTIFIC IND PVT LTD. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingHorizontal: 30,
    justifyContent: 'space-between', // Ensures content and footer are spaced
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 270,
    height: 150,
    marginBottom: 29,
  },
  title: {
    fontSize: 24,
    color: '#C0C0C0',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'sans-serif-medium',
  },
  subtitle: {
    fontSize: 13,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'sans-serif-light',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '95%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  footerText: {
    color: '#7b7d7d',
    fontSize: 14,
    fontFamily: 'sans-serif-thin',
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 14,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  copyrightText: {
    color: "#7F8C8D", 
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login_page;
