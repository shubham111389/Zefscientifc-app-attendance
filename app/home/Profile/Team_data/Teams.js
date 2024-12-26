import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import useRegionData from '../../../../Hooks/useRegion';
import useUser from '../../../../Hooks/useUser';
import LoadingScreen from '../LoadingScreen';
import RNPickerSelect from 'react-native-picker-select';
import { router } from 'expo-router';
import { API_URL_FOR_JOB_REGISTER_POST} from '@env';
import { API_URL_FOR_EXPENSE_POST } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '../Footer';

const Teams = () => {
  const { regionData, loading, error } = useRegionData();
  const [userRegion, setUserRegion] = useState();
  const { userData, loading1 } = useUser();
  const [filteredRegionData, setFilteredRegionData] = useState([]);
  const [selectedReport, setSelectedReport] = useState("Expense Report");
  const [jobRegisterData, setJobRegisterData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const[isLoading, setIsLoading] = useState(true);
 

  useEffect(() => {
    if (userData?.region) {
      setUserRegion(userData.region);
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.region && regionData?.length) {
      const regionMapping = regionData.find((data) => data.id === 'Region');
      const userRegionData = regionMapping?.[userRegion];
      setFilteredRegionData(userRegionData);
    }
  }, [userData, regionData]);

  // New useEffect for fetching job register data
  useEffect(() => {
    const fetchJobRegisterData = async () => {
      try {
        const response = await fetch(API_URL_FOR_JOB_REGISTER_POST);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setJobRegisterData(result.data);
   
      } catch (error) {
        console.error('Error fetching job register data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRegisterData();
  }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(API_URL_FOR_EXPENSE_POST);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
        
          setExpenseData(result.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);
 

  const handlePress = (routeName, employeeName) => {
    if (routeName === "Job Register") {
      // Find job register data for the specific employee
      const employeeJobData = jobRegisterData?.filter(job => "Abhishekh" === employeeName);
   
      
      router.push({
        pathname: "/home/Profile/Team_data/Employee_job_Report",
        params: { 
          employeeName: employeeName,
          jobRegisterData: JSON.stringify(employeeJobData) // Convert to string for routing
        },
      });
    } else if (routeName === "Expense Report") {
      const employeeExpenseData = expenseData?.filter(job => "Abhishekh" === employeeName);
      
      
      router.push({
        pathname: "/home/Profile/Team_data/Employee_Expense_Report",
        params: { employeeName: employeeName ,
        expenseData: JSON.stringify(employeeExpenseData)
        }
      });
    }
  };
  if (loading || loading1 || isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={["#0F1B2C", "#172435"]} 
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="groups" size={28} color="#3498DB" />
            <Text style={styles.headerTitle}>My Team</Text>
          </View>
          <MaterialIcons name="notifications-none" size={28} color="#3498DB" />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>Select Report Type</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedReport(value)}
                value={selectedReport}
                style={pickerSelectStyles}
                items={[
                  { label: 'Job Register', value: 'Job Register' },
                  { label: 'Expense Report', value: 'Expense Report' }
                ]}
              />
            </View>
          </View>

          <View style={styles.reportSection}>
            {filteredRegionData?.map((employee, index) => (
              <Pressable
                key={index}
                onPress={() => handlePress(selectedReport, employee)}
                style={styles.reportButton}
              >
                <View style={styles.reportIconContainer}>
                  <Ionicons name="person-circle-outline" size={24} color="#3498DB" />
                </View>
                <Text style={styles.reportText}>{employee}</Text>
                <View style={styles.reportChevronContainer}>
                  <MaterialIcons name="chevron-right" size={24} color="#E67E22" />
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.footerWrapper}>
          <Footer />
        </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    backgroundColor: 'transparent', // Changed to transparent
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#ECF0F1',
    borderWidth: 1,
    borderColor: '#2C3E50',
    marginBottom: 15,
  },
  inputAndroid: {
    height: 40,
    backgroundColor: 'transparent', 
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#ECF0F1',
    borderWidth: 1,
    borderColor: '#2C3E50',
    marginBottom: 15,
  },
  iconContainer: {
    top: 12,
    right: 12,
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1B2C'
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#0F1B2C',
    zIndex: 1000
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: '#ECF0F1',
  },
  scrollViewContent: {
    paddingHorizontal: 18,
  },
  selectionContainer: {
    paddingTop: 20,
    marginBottom: 20, // Added margin to create space between picker and report section
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: '#ECF0F1',
    paddingBottom: 20,
  },
  pickerContainer: {
    backgroundColor: "#172435",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C3E50',
    marginBottom: 0, // Removed negative margin
  },
  reportSection: {
    backgroundColor: "#172435",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  reportButton: {
    backgroundColor: "#0F1B2C",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  reportIconContainer: {
    padding: 7,
    width: 45,
    height: 45,
    borderRadius: 7,
    backgroundColor: "#172435",
    alignItems: "center",
    justifyContent: "center",
  },
  reportText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    color: '#ECF0F1',
  },
  reportChevronContainer: {
    width: 35,
    height: 35,
    borderRadius: 7,
    backgroundColor: "#172435",
    alignItems: "center",
    justifyContent: "center",
  },
  footerWrapper: {
    
    paddingBottom:-10,
  
    
    backgroundColor: 'transparent',
  },
});


export default Teams;