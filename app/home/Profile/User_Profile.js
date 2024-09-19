import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import useUserData from '../../../Hooks/useUserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timestamp } from 'firebase/firestore'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Mobile from 'react-native-vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import Gender from 'react-native-vector-icons/Foundation';
import Profession from 'react-native-vector-icons/AntDesign';
import LoadingScreen from './LoadingScreen';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

const User_Profile = () => {
  const { userDetails } = useUserData();  // Fetch user data from the custom hook
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  useEffect(() => {
    if (userDetails) {
      setIsLoading(false);  // Stop loading once user data is available
    }
  }, [userDetails]);

  // Helper function to convert Firestore timestamp to Date object
  const convertFirestoreTimestampToDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    } else {
      console.error('Invalid Timestamp');
      return null;
    }
  };

  // Handle sign-out process
  const handleSignOut = async () => {
    try {
      // Clear AsyncStorage and sign out from Firebase
      await AsyncStorage.removeItem('@user_data');
      await signOut(auth);
      router.push('../Login_form');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  // Show loading screen while user data is being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Formatting the joining date
  const joiningDate = convertFirestoreTimestampToDate(userDetails?.joiningDate);
  const formattedJoiningDate = joiningDate ? joiningDate.toDateString() : '';

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        {/* Top section with a background image and logout button */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={styles.backIcon}>
          <Ionicons name="arrow-back-circle-outline" size={30} color="white" onPress={()=>( router.push('./Home'))} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editIcon} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={19} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Image
            width={100}
            height={80}
            resizeMode="cover"
            style={styles.backgroundImage}
            source={require('../../../assets/wave.png')}
          />
        </View>

        {/* Profile image */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity>
            <Image
              source={{
                uri:
                  userDetails?.photo ||
                  'https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png',
              }}
              style={styles.avatar}
              resizeMode="stretch"
              onError={(error) => {
                Alert.alert('Error', 'Unable to load profile image.');
              }}
            />
          </TouchableOpacity>
        </View>

        {/* User name */}
        <View style={{ marginTop: -50 }}>
          <Text style={styles.nameText}>
            {userDetails?.firstName} {userDetails?.lastname}
          </Text>
        </View>

        {/* User information */}
        <View style={styles.userInfoContainer}>
          {/* Email */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#ff9500' }]}>
                <Email name="email" size={24} style={{ color: 'white' }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Email</Text>
                <Text style={styles.infoLarge_Text} numberOfLines={1}>
                  {userDetails?.email || 'john.doe@example.com'}
                </Text>
              </View>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#0d7313' }]}>
                <Gender name="torsos-male-female" size={28} style={{ color: 'white' }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Gender</Text>
                <Text style={styles.infoLarge_Text}>
                  {userDetails?.gender || 'Male'}
                </Text>
              </View>
            </View>
          </View>

          {/* Profession */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#774BBC' }]}>
                <Profession name="profile" size={24} style={{ color: 'white' }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Profession</Text>
                <Text style={styles.infoLarge_Text}>
                  {userDetails?.profession || 'Engineer'}
                </Text>
              </View>
            </View>
          </View>

          {/* Joining Date */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#ff9500' }]}>
                <Entypo name="calendar" size={24} color="white" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Joining Date</Text>
                <Text style={styles.infoLarge_Text}>
                  {formattedJoiningDate || 'Joining Date'}
                </Text>
              </View>
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#f2276e' }]}>
                <Mobile name="mobile" size={24} style={{ color: 'white' }} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Mobile</Text>
                <Text style={styles.infoLarge_Text}>
                  {userDetails?.mobile || '+1234567890'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  editIcon: {
    zIndex: 1,
    position: 'absolute',
    right: 2,
  
    marginRight: 16,
    marginTop:19,
    flexDirection: 'row',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 4,
    marginTop: -3,
  },
  backIcon: {
    zIndex: 1,
    position: 'absolute',
    left: 2,
    margin: 15,
  },
  avatar: {
    borderRadius: 100,
    marginTop: -250,
    backgroundColor: 'white',
    height: 200,
    width: 200,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfoContainer: {
    marginTop: 20,
    marginHorizontal: 25,
  },
  infoMain: {
    marginTop: 10,
  },
  infoCont: {
    flexDirection: 'row',
  },
  infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  infoText: {
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
  },
  infoSmall_Text: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  infoLarge_Text: {
    color: 'black',
  },
  backgroundImage: {
    marginTop: -140,
  },
});

export default User_Profile;
