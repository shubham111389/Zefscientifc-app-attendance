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
  const { userDetails } = useUserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userDetails) {
      setIsLoading(false);
      console.log(userDetails);
    }
  }, [userDetails]);

  const convertFirestoreTimestampToDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return null;
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      await signOut(auth);
      router.push('../Login_page');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const joiningDate = convertFirestoreTimestampToDate(userDetails?.joining_date);
  const formattedJoiningDate = joiningDate ? joiningDate.toDateString() : '';

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#0F1B2C' }}>
      <View>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={styles.backIcon}>
            <Ionicons name="arrow-back-circle-outline" size={30} color="#ECF0F1" onPress={() => router.push('./Home')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editIcon} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={19} color="#ECF0F1" />
            <Text style={[styles.logoutText, { color: '#ECF0F1' }]}>Logout</Text>
          </TouchableOpacity>
          <Image
            width={100}
            height={80}
            resizeMode="cover"
            style={styles.backgroundImage}
            source={require('../../../assets/wave.png')}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity>
            <Image
              source={{
                uri: userDetails?.photo ||
                  'https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png',
              }}
              style={[styles.avatar, { backgroundColor: '#172435', borderColor: '#2C3E50' }]}
              resizeMode="stretch"
              onError={(error) => {
                Alert.alert('Error', 'Unable to load profile image.');
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: -50 }}>
          <Text style={[styles.nameText, { color: '#ECF0F1' }]}>
            {userDetails?.firstName} {userDetails?.lastname}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#3498DB' }]}>
                <Email name="email" size={24} style={{ color: '#ECF0F1' }} />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Email</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]} numberOfLines={1}>
                  {userDetails?.email || 'john.doe@example.com'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#2ECC71' }]}>
                <Gender name="torsos-male-female" size={28} style={{ color: '#ECF0F1' }} />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Gender</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]}>
                  {userDetails?.gender || 'Male'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#9B59B6' }]}>
                <Profession name="profile" size={24} style={{ color: '#ECF0F1' }} />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Profession</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]}>
                  {userDetails?.profession || 'Engineer'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#3498DB' }]}>
                <Ionicons name="earth" size={24} style={{ color: '#ECF0F1' }} />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Region</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]}>
                  {userDetails?.region || 'Not Specified'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#E67E22' }]}>
                <Entypo name="calendar" size={24} color="#ECF0F1" />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Joining Date</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]}>
                  {formattedJoiningDate || 'Joining Date'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, { backgroundColor: '#E74C3C' }]}>
                <Mobile name="mobile" size={24} style={{ color: '#ECF0F1' }} />
              </View>
              <View style={[styles.infoText, { borderColor: '#2C3E50' }]}>
                <Text style={[styles.infoSmall_Text, { color: '#7F8C8D' }]}>Mobile</Text>
                <Text style={[styles.infoLarge_Text, { color: '#ECF0F1' }]}>
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
    marginTop: 19,
    flexDirection: 'row',
  },
  logoutText: {
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
    height: 200,
    width: 200,
    padding: 10,
    borderWidth: 1,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
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
  },
  infoText: {
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  infoSmall_Text: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoLarge_Text: {
  },
  backgroundImage: {
    marginTop: -140,
  },
});

export default User_Profile;