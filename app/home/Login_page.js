import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";


const ZefScientificLogin = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image 
        source={require('./../../assets/logo1.png')} // Replace with your logo's path
        style={styles.logo}
      />
      
      <Text style={styles.title}>ᴢᴇꜰ ꜱᴄɪᴇɴᴛɪꜰɪᴄ ɪɴᴅ ᴘᴠᴛ ʟᴛᴅ
      </Text>
      
      <Text style={styles.subtitle}>Verify your identity to get started ?</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("home/Login_form")}>
        <Text style={styles.buttonText}>Continue with Email</Text>
      </TouchableOpacity>

      {/* Footer text */}
      <Text style={styles.footerText}>v1.0.0</Text>
      
      <TouchableOpacity>
        <Text style={styles.linkText}>Terms of Service - Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  footerText: {
    color: '#555555',
    fontSize: 14,
    marginTop: 70,
    fontFamily: 'sans-serif-thin',
  },
  linkText: {
    color: '#1e90ff',
    fontSize: 14,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default ZefScientificLogin;
