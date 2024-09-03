import { useState } from 'react';
import { Alert } from 'react-native';

const useFormSubmit = (url) => {
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

  const submitForm = async () => {
    const formDatab = new FormData();
    formDatab.append('Name', formData.Name);
    formDatab.append('Address', formData.Address);
    formDatab.append('Phone', formData.Phone);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formDatab,
      });

      const data = await response.json();
      console.log(data);
      Alert.alert('Success', 'Form submitted successfully!');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to submit the form.');
    }
  };

  return {
    formData,
    handleInputChange,
    submitForm,
  };
};

export default useFormSubmit;
