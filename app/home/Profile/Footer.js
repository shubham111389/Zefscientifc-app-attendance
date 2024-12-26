import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          If you have any issues or need further assistance, please contact us at 
          <Text style={styles.contactEmail}> a.shubham@zefsci.com</Text>
        </Text>
      </View>
      <View style={styles.socialIconsContainer}>
        <FontAwesome name="facebook" size={24} color="#3498DB" style={styles.icon} />
        <FontAwesome name="twitter" size={24} color="#1DA1F2" style={styles.icon} />
        <FontAwesome name="linkedin" size={24} color="#0077B5" style={styles.icon} />
        <FontAwesome name="instagram" size={24} color="#E1306C" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 11,
    borderTopWidth: 1,
    borderColor: '#333333', // Darker border color
    marginTop: 10,
    marginBottom: 3,
     // Dark background to match main container
  },
  contactContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ffffff', // White text for dark theme
  },
  contactEmail: {
    color: '#3498db', // Light blue to match the theme
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Footer;