import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Asset } from 'expo-asset';

Asset.loadAsync(require('./../../../assets/offline.png'));

const OfflineComponent = () => {
  return (
    <View style={styles.offlineContainer}>
    <Image 
  source={require('./../../../assets/offline.png')} 
  style={{ width: 100, height: 100 }} // Add width and height to ensure the image is displayed
/>
      <Text style={styles.offlineText}> Connection Lost!</Text>
      <Text style={styles.subText}>
        It seems you're offline. Reconnect to continue logging your jobs and tracking expenses seamlessly.
      </Text>
      <Text style={styles.inspirationalText}>
        Stay connected, stay on top of your tasks with ZefScientific’s Job Register & Expense Report.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf2f2', // Light pastel red for a soft background
    paddingHorizontal: 20,
  },
  offlineIcon: {
    marginBottom: 30,
  },
  offlineText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c9302c', // Bright red for stronger emphasis
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase', // Adding emphasis
  },
  subText: {
    fontSize: 18,
    color: '#a94442', // Slightly darker red for a professional look
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24, // Better readability
  },
  inspirationalText: {
    fontSize: 16,
    color: '#555', // Neutral color for the inspirational text
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
});

export default OfflineComponent;
