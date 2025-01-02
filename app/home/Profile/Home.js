import { StyleSheet, Text, View, ScrollView, Pressable, Image, SafeAreaView } from "react-native";
import { useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Feather, Entypo, Ionicons, Octicons, MaterialIcons, FontAwesome6, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

import useUserData from "../../../Hooks/useUserData";
import OfflineComponent from './OfflineComponent';
import useOnline from '../../../Hooks/useOnline'; 
import LoadingScreen from "./LoadingScreen";




const Home = () => {
  const isOnline = useOnline(); 
  const router = useRouter();
  const [userdata,setUserData] = useState();
  const { userDetails } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  
 
 
    

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData !== null) {
        const user1 = JSON.parse(userData);
        setUserData(user1);
        console.log(user1);
      } else {
        router.push('../Login_page');
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    } finally {
      setIsLoading(false);
    }
  };


  

  

  useEffect(() => {
    checkUserSession();
  }, []); 

  if (isLoading ) {
    return <LoadingScreen />;
  }

  if (!isOnline ) {
    return <OfflineComponent />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={["#0F1B2C", "#172435"]} 
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            source={require('../../../assets/icon.png')} 
          />
          <Text style={styles.companyName}>ZEF SCIENTIFIC IND PVT LTD</Text>
          <Pressable onPress={() => router.push('./User_Profile')}>
            <FontAwesome name="user-circle" size={26} color="#3498DB" />
          </Pressable>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.actionContainer}>
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => router.push('./Mark_job_register')}
                style={styles.actionButton}
              >
                <View style={styles.actionIconContainer}>
                  <MaterialIcons name="work" size={24} color="#3498DB" />
                </View>
                <Text style={styles.actionText}>Mark Job Register</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("./Mark_Expense_Report")}
                style={styles.actionButton}
              >
                <View style={styles.actionIconContainer}>
                  <FontAwesome6 name="wallet" size={24} color="#2ECC71" />
                </View>
                <Text style={styles.actionText}>Mark Expense Report</Text>
              </Pressable>
            </View>

            <View style={styles.singleActionContainer}>
              <Pressable style={styles.singleActionButton}>
                <View style={styles.singleActionIconContainer}>
                  <FontAwesome5 name="tools" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionText}>Stock List</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.reportSection}>
          <Pressable 
                onPress={() => router.push({
                  pathname: "/home/Profile/Job_Register_Report",
                
              })}
                style={styles.reportButton}
              >
              <View style={styles.reportIconContainer}>
                <MaterialIcons name="work-outline" size={24} color="#3498DB" />
              </View>
              <Text style={styles.reportText}>Job Register Report</Text>
              <View style={styles.reportChevronContainer}>
                <Entypo name="chevron-right" size={24} color="#E67E22" />
              </View>
            </Pressable>
            
            <Pressable
              onPress={() => router.push({
                pathname: "/home/Profile/Expense_Report",
               
              
            })}
            style={styles.reportButton}
            >
        
              <View style={styles.reportIconContainer}>
                <MaterialCommunityIcons name="wallet-outline" size={24} color="#2ECC71" />
              </View>
              <Text style={styles.reportText}>Expenses Report</Text>
              <View style={styles.reportChevronContainer}>
                <Entypo name="chevron-right" size={24} color="#E67E22" />
              </View>
            </Pressable>

            <Pressable style={styles.reportButton}>
              <View style={styles.reportIconContainer}>
                <MaterialIcons name="my-library-books" size={24} color="#9B59B6" />
              </View>
              <Text style={styles.reportText}>All Instruments Manuals</Text>
              <View style={styles.reportChevronContainer}>
                <Entypo name="chevron-right" size={24} color="#E67E22" />
              </View>
            </Pressable>

            <Pressable style={styles.reportButton}>
              <View style={styles.reportIconContainer}>
                <MaterialCommunityIcons name="lightbulb-group-outline" size={24} color="#1ABC9C" />
              </View>
              <Text style={styles.reportText}>Engineers Experiences</Text>
              <View style={styles.reportChevronContainer}>
                <Entypo name="chevron-right" size={24} color="#E67E22" />
              </View>
            </Pressable>
          </View>

          {(userdata?.Profession === 'Manager' || userDetails?.Profession === 'Manager') && (
            <View style={styles.managerSection}>
              <Pressable 
                onPress={() => router.push({
                  pathname: "/home/Profile/Team_data/Teams",
                 
                
              })}
                style={styles.managerButton}
              >
                <View style={styles.managerIconContainer}>
                  <MaterialIcons name="groups-2" size={24} color="#1ABC9C" />
                </View>
                <Text style={styles.actionText}>My Team Reports</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.bottomActionsContainer}>
            <Pressable style={styles.bottomActionButton}>
              <View style={styles.bottomActionIconContainer}>
                <MaterialCommunityIcons name="guy-fawkes-mask" size={24} color="#E74C3C" />
              </View>
              <Text style={styles.actionText}>Request Leave</Text>
            </Pressable>
            <Pressable style={styles.bottomActionButton}>
              <View style={styles.bottomActionIconContainer}>
                <MaterialCommunityIcons name="tools" size={24} color="#F39C12" />
              </View>
              <Text style={styles.actionText}>Request Parts</Text>
            </Pressable>
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.copyrightText}>
              © 2024 ZEF SCIENTIFIC IND PVT LTD. All rights reserved.
            </Text>
            <View style={styles.socialIcons}>
              <FontAwesome name="facebook" size={24} color="#3498DB" style={styles.socialIcon} />
              <FontAwesome name="twitter" size={24} color="#1DA1F2" style={styles.socialIcon} />
              <FontAwesome name="linkedin" size={24} color="#0077B5" style={styles.socialIcon} />
              <FontAwesome name="instagram" size={24} color="#E1306C" style={styles.socialIcon} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0F1B2C'
  },
  gradientBackground: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#0F1B2C', // Match the background color
    zIndex: 1000 // Ensure it stays on top
  },
  scrollViewContent: {
    paddingHorizontal: 18,
    paddingBottom: 5,
  },
  logo: {
    width: 60, 
    height: 26,
    tintColor: '#3498DB' // Modern blue tint
  },
  companyName: {
    fontSize: 18, 
    fontWeight: "600",
    color: '#ECF0F1'
  },
  actionContainer: {
    marginBottom: 20
  },
  actionRow: {
    flexDirection: "row", 
    gap: 20
  },
  actionButton: {
    backgroundColor: "#172435",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: '#2C3E50'
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0F1B2C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  actionText: {
    color: '#ECF0F1',
    fontWeight: "600",
    fontSize: 12,
    textAlign: 'center'
  },
  singleActionContainer: {
    marginTop: 20
  },
  singleActionButton: {
    backgroundColor: "#172435",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#2C3E50'
  },
  singleActionIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 7,
    backgroundColor: "#0F1B2C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  reportSection: {
    backgroundColor: "#172435",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 20
  },
  reportButton: {
    backgroundColor: "#0F1B2C",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
    borderWidth: 1,
    borderColor: '#2C3E50'
  },
  reportIconContainer: {
    padding: 7,
    width: 45,
    height: 45,
    borderRadius: 7,
    backgroundColor: "#172435",
    alignItems: "center",
    justifyContent: "center"
  },
  reportText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    color: '#ECF0F1'
  },
  reportChevronContainer: {
    width: 35,
    height: 35,
    borderRadius: 7,
    backgroundColor: "#172435",
    alignItems: "center",
    justifyContent: "center"
  },
  managerSection: {
    marginBottom: 20
  },
  managerButton: {
    backgroundColor: "#172435", 
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#2C3E50'
  },
  managerIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 7,
    backgroundColor: "#0F1B2C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  bottomActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20
  },
  bottomActionButton: {
    backgroundColor: "#172435",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: '#2C3E50'
  },
  bottomActionIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 7,
    backgroundColor: "#0F1B2C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  footerContainer: {
    alignItems: "center", 
    marginTop: 10,
    marginBottom: 20
  },
  copyrightText: {
    color: "#7F8C8D", 
    fontSize: 12,
    textAlign: 'center'
  },
  socialIcons: {
    flexDirection: "row", 
    marginTop: 12
  },
  socialIcon: {
    marginHorizontal: 10
  }
});