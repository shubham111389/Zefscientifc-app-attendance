import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const Login_form = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [EmployeeCode, setEmployeeCode] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async () => {
    // Check for email and password errors
    if (emailError || email === '') {
      alert('Please use a @zefsci.com email address');
      return;
    } else if (passwordError) {
      alert(JSON.stringify(passwordError));
      return;
    }
    
    // Start loading
    setLoading(true);
    try {
      if (isSignInForm) {
        // Sign In logic
        await signInWithEmailAndPassword(auth, email, password);
        alert("Welcome in ZEF SCIENTIFIC IND PVT LTD");
        console.log("User signed in successfully");
        router.push("/home/Profile");
      } else {
        // Sign Up logic
       
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          console.log(user);
          if (user) {
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              firstName: FirstName,
              lastname: LastName,
              Employee_Code : EmployeeCode,
              photo:""
            });

          }
          console.log("User Registered Successfully!!");
          alert("Welcome in ZEF SCIENTIFIC PVT LTD ")
          router.push("/home/Profile")
          
        } catch (error) {
          console.log(error.message);
          
        }

      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      alert(JSON.stringify(error.message));
    } 
  };

  const validatePassword = (inputPassword) => {
    setPassword(inputPassword);

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(inputPassword);
    const hasLowerCase = /[a-z]/.test(inputPassword);
    const hasNumber = /[0-9]/.test(inputPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(inputPassword);

    if (inputPassword.length < minLength) {
      setPasswordError(`Password must be at least ${minLength} characters long.`);
    } else if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
    } else if (!hasLowerCase) {
      setPasswordError('Password must contain at least one lowercase letter.');
    } else if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
    } else if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character.');
    } else {
      setPasswordError(''); // Clear the error if the password is valid
    }
    console.log(passwordError);
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  }; 
  const handleEmailChange = (inputEmail) => {
    setEmail(inputEmail);

    // Check if the email ends with '@zefsci.com'
    if (!inputEmail.endsWith('@zefsci.com')) {
      setEmailError('Please use a @zefsci.com email address.');
    } else {
      setEmailError(''); // Clear the error if the email is valid
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://as1.ftcdn.net/v2/jpg/04/79/83/18/1000_F_479831845_S6LGeWAaIs6LzUSIsqwYYhB0OSbGqBZZ.jpg' }} style={styles.backgroundImage} />
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isSignInForm ? 'Sign In' : 'Sign Up'}</Text>

        {!isSignInForm && (
          <>
            <TextInput
              placeholder="First Name"
              style={styles.input}
              placeholderTextColor="#ccc"
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              placeholderTextColor="#ccc"
              onChangeText={(text) => setLastName(text)} 
            />
            <TextInput
              placeholder="Employee Code"
              style={styles.input}
              placeholderTextColor="#ccc"
              autoCapitalize="characters"
              onChangeText={(text) => setEmployeeCode(text)}
            />
          </>
        )}
        
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleEmailChange}
        />
        
        <TextInput
          placeholder="Password"
          style={styles.input}
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isSignInForm ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={toggleSignInForm}>
          <Text style={styles.toggleText}>
            {isSignInForm ? 'New here? Sign Up Now' : 'Already registered? Sign In Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for title
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#1e90ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default Login_form;