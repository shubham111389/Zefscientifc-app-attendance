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
        <FontAwesome name="facebook" size={24} color="Gray" style={styles.icon} />
        <FontAwesome name="twitter" size={24} color="Gray" style={styles.icon} />
        <FontAwesome name="linkedin" size={24} color="Black" style={styles.icon} />
        <FontAwesome name="instagram" size={24} color="Black" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 11,
    borderTopWidth: 1,
    borderColor: '#E6E6E6',
    marginTop:10,
    marginBottom:3,
    // Match the main container's background
  },
  contactContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
  },
  contactEmail: {
    color: '#6200ee',
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom:10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default Footer;
