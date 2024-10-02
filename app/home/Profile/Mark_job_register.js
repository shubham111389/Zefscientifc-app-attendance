import React, { useState } from 'react';
import Config from 'react-native-config'
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import {API_URL_FOR_POST} from "@env"


const Mark_job_register=() =>{
  const [formData, setFormData] = useState({
    Name: '',
    Address: '',
    Phone: ''
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const Submit = async () => {
    const formDatab = new FormData();
    formDatab.append('Name', formData.Name);
    formDatab.append('Address', formData.Address);
    formDatab.append('Phone', formData.Phone);

    try {
      const response = await fetch(
        API_URL_FOR_POST,
        {
          method: 'POST',
          body: formDatab,
        }
      );

      const data = await response.json();
      console.log(data);
    alert('Success', 'Form submitted successfully!');
    } catch (error) {
      console.log(error.message);
      alert('Error', 'Failed to submit the form.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Registers</Text>
      <Text style={styles.subtitle}>
         Mark_Job_Register_Form
      </Text>
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
}
export default Mark_job_register

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
