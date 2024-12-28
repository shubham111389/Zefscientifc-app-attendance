import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import useOnline from '../../Hooks/useOnline';
import OfflineComponent from './Profile/OfflineComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './Profile/CustomAlert';

const LoginForm = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [formData, setFormData] = useState({
    email: { value: '', error: '' },
    password: { value: '', error: '' },
    firstName: { value: '', error: '' },
    lastName: { value: '', error: '' },
    employeeCode: { value: '', error: '' }
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });
  const router = useRouter();
  const isOnline = useOnline();

  const showAlert = (type, title, message) => {
    setAlert({
      visible: true,
      type,
      title,
      message
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
    if (alert.type === 'success') {
      router.push("/home/Profile/Home");
    }
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { value, error: validateField(field, value) }
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        if (!value.endsWith('@zefsci.com')) return 'Please use a @zefsci.com email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Include at least one number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Include at least one special character';
        return '';
      case 'firstName':
        return !value && !isSignInForm ? 'First name is required' : '';
      case 'lastName':
        return !value && !isSignInForm ? 'Last name is required' : '';
      case 'employeeCode':
        return !value && !isSignInForm ? 'Employee code is required' : '';
      default:
        return '';
    }
  };

  const storeUserData = async (userDetails) => {
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userDetails));
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      showAlert('error', 'Storage Error', 'Failed to store user data');
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(field => {
      if (!isSignInForm && ['firstName', 'lastName', 'employeeCode'].includes(field) || 
          ['email', 'password'].includes(field)) {
        errors[field] = validateField(field, formData[field].value);
      }
    });

    // Update form with any errors
    setFormData(prev => {
      const updated = { ...prev };
      Object.keys(errors).forEach(field => {
        updated[field] = { ...prev[field], error: errors[field] };
      });
      return updated;
    });

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    setLoading(true);

    try {
      if (isSignInForm) {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email.value, 
          formData.password.value
        );
        
        const userDetails = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        };
        
        await storeUserData(userDetails);
        showAlert('success', 'Welcome!', 'Successfully signed in to ZEF SCIENTIFIC IND PVT LTD');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email.value, 
          formData.password.value
        );
        
        await setDoc(doc(db, "Users", userCredential.user.uid), {
          email: formData.email.value,
          firstName: formData.firstName.value,
          lastName: formData.lastName.value,
          employeeCode: formData.employeeCode.value,
          photo: ""
        });

        const userDetails = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: formData.firstName.value,
        };
        
        await storeUserData(userDetails);
        showAlert('success', 'Welcome!', 'Successfully registered with ZEF SCIENTIFIC IND PVT LTD');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const errorMessages = {
        'auth/wrong-password': {
          title: 'Invalid Credentials',
          message: 'The password you entered is incorrect. Please try again.'
        },
        'auth/user-not-found': {
          title: 'Account Not Found',
          message: 'No account exists with this email address.'
        },
        'auth/email-already-in-use': {
          title: 'Email Already Registered',
          message: 'This email is already registered. Please sign in instead.'
        },
        'auth/invalid-email': {
          title: 'Invalid Email',
          message: 'Please enter a valid email address.'
        },
        'auth/weak-password': {
          title: 'Weak Password',
          message: 'Password should be at least 6 characters long.'
        },
        'default': {
          title: 'Error',
          message: 'An unexpected error occurred. Please try again.'
        }
      };

      const errorInfo = errorMessages[error.code] || errorMessages.default;
      showAlert('error', errorInfo.title, errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOnline) return <OfflineComponent />;

  const renderInput = (field, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, formData[field].error && styles.inputError]}
        placeholderTextColor="#999"
        value={formData[field].value}
        onChangeText={(text) => updateFormField(field, text)}
        {...options}
      />
      {formData[field].error ? (
        <Text style={styles.errorText}>{formData[field].error}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image 
        source={{ uri: 'https://as1.ftcdn.net/v2/jpg/04/79/83/18/1000_F_479831845_S6LGeWAaIs6LzUSIsqwYYhB0OSbGqBZZ.jpg' }} 
        style={styles.backgroundImage} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isSignInForm ? 'Sign In' : 'Sign Up'}</Text>
          
          {!isSignInForm && (
            <>
              {renderInput('firstName', 'First Name')}
              {renderInput('lastName', 'Last Name')}
              {renderInput('employeeCode', 'Employee Code', {
                autoCapitalize: 'characters'
              })}
            </>
          )}
          
          {renderInput('email', 'Email Address', {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoComplete: 'email'
          })}
          
          {renderInput('password', 'Password', {
            secureTextEntry: true,
            autoComplete: 'password'
          })}

          {loading ? (
            <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isSignInForm ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => {
              setIsSignInForm(!isSignInForm);
              setFormData({
                email: { value: '', error: '' },
                password: { value: '', error: '' },
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                employeeCode: { value: '', error: '' }
              });
            }}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {isSignInForm ? 'New here? Sign Up Now' : 'Already registered? Sign In Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 10,
  },
  toggleText: {
    color: '#1e90ff',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: 20,
  },
});

export default LoginForm;