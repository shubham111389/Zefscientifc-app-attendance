import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import {API_URL_FOR_POST} from "@env"



const Mark_job_register = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Address: '',
    Phone: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const Submit = async () => {
    try {
      const formData = new FormData();
      formData.append('Name', formData.Name);
      formData.append('Address', formData.Address);
      formData.append('Phone', formData.Phone);
      console.log(API_URL_FOR_POST);
      const response = await fetch(
        API_URL_FOR_POST,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(data);
        Alert.alert('Success', 'Form submitted successfully!');
      } else {
        const text = await response.text();
        console.log('Response is not JSON:', text);
        Alert.alert('Error', `Failed to submit the form: ${text}`);
      }
    } catch (error) {
      console.error('Network or other error:', error);
      Alert.alert('Error', `Failed to submit the form: ${error.message}`);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Register</Text>
      <Text style={styles.subtitle}>Mark Job Register Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        onChangeText={(value) => handleInputChange('Name', value)}
        value={formData.Name}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Address"
        onChangeText={(value) => handleInputChange('Address', value)}
        value={formData.Address}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Phone"
        onChangeText={(value) => handleInputChange('Phone', value)}
        value={formData.Phone}
      />
      <Button title="Submit" onPress={Submit} />
    </View>
  );
};

export default Mark_job_register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});