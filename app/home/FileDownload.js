import React from 'react';
import { View, Button, StyleSheet, Alert, Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const FileDownload = () => {
  
  // Function to save the file in the directory
  async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        // Fallback MIME type for Excel files
        const safeMimetype = mimetype || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // Default MIME type for Excel

        // Create the file in the storage and write the data
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, safeMimetype)
          .then(async (fileUri) => {
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch((e) => console.log(e));
      } else {
        Alert.alert('Permission Required', 'You need to grant permission to save files');
      }
    } else {
      shareAsync(uri); // Handle non-Android case (iOS)
    }
  }

  // Function to download the file
  async function download() {
    const filename = "dummy";
    const url = 'https://zefsci-my.sharepoint.com/:x:/p/a_shubham/EZmfqW2K44RMphIVcrhJ57YBBzTAnAatrCPDh2IWGH5weA?e=YwXDkX'
    
    try {
      // Download the file
      const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + filename);
      console.log(result);

      // MIME Type - Default for Excel file
      const mimeType = result.headers["Content-Type"] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // Save the downloaded file
      saveFile(result.uri, filename, mimeType);

      Alert.alert('Success', 'File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Download Excel File" onPress={download} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default FileDownload;
