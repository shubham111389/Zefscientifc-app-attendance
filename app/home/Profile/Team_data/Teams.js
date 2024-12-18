import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import useRegionData from '../../../../Hooks/useRegion';
import useUser from '../../../../Hooks/useUser';
import LoadingScreen from '../LoadingScreen';
import RNPickerSelect from 'react-native-picker-select'; // Import modern picker
import { router } from 'expo-router';

const Teams = () => {
  const { regionData, loading, error } = useRegionData();
  const [userRegion, setUserRegion] = useState();
  const { userData, loading1 } = useUser();
  const [filteredRegionData, setFilteredRegionData] = useState([]);
  const [selectedReport, setSelectedReport] = useState("Job Register");

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

  const handlePress = (routeName, employeeName) => {
    console.log(`${routeName} pressed, Employee: ${employeeName}`);
    if (routeName === "Job Register") {
      router.push({
        pathname: "/home/Profile/Team_data/Employee_job_Report",
        params: { employee: employeeName }, // Pass employee name here
      });
    } else if (routeName === "Expense Report") {
      router.push({
        pathname: "/home/Profile/Team_data/Employee_Expense_Report",
        params: { employee: employeeName }, // Pass employee name here
      });
    }
  };
  

  if (loading || loading1) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="groups" size={32} color="#ffffff" style={styles.headerIcon} />
        <Text style={styles.header}>My Team</Text>
      </View>

      {/* Selection Box for Job Register or Expense Report */}
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionLabel}>Select Report Type:</Text>
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

      {/* Job Register View */}
      {selectedReport === "Job Register" && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Job Register</Text>
          <View style={styles.employeeList}>
            {filteredRegionData?.map((employee, index) => (
              <Pressable
                key={index}
                onPress={() => handlePress("Job Register",employee)}
                style={({ pressed }) => [
                  styles.employeeButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.employeeContent}>
                  <Ionicons name="person-circle-outline" size={28} color="#34495e" style={styles.icon} />
                  <Text style={styles.employeeText}>{employee}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Expense Report View */}
      {selectedReport === "Expense Report" && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Expense Report</Text>
          <View style={styles.employeeList}>
            {filteredRegionData?.map((employee, index) => (
              <Pressable
                key={index}
                onPress={() => handlePress("Expense Report",  employee)}
                style={({ pressed }) => [
                  styles.employeeButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.employeeContent}>
                  <Ionicons name="person-circle-outline" size={28} color="#34495e" style={styles.icon} />
                  <Text style={styles.employeeText}>{employee}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Contact Info */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          If you have any issues or need further assistance, please contact us at 
          <Text style={styles.contactEmail}> a.shubham@zefsci.com</Text>
        </Text>
      </View>

      {/* Social Icons */}
      <View style={styles.socialIconsContainer}>
        <FontAwesome name="facebook" size={24} color="Gray" style={styles.icon} />
        <FontAwesome name="twitter" size={24} color="Gray" style={styles.icon} />
        <FontAwesome name="linkedin" size={24} color="Black" style={styles.icon} />
        <FontAwesome name="instagram" size={24} color="Black" style={styles.icon} />
      </View>
    </ScrollView>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#34495e',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputAndroid: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#34495e',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerIcon: {
    marginRight: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  selectionContainer: {
    marginBottom: 20,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 15,
  },
  employeeList: {
    marginTop: 10,
  },
  employeeButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6eaf8',
  },
  pressed: {
    backgroundColor: '#d6eaf8',
  },
  employeeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  employeeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  contactContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems:'center',
  },
  contactText: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
  },
  contactEmail: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    margin: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 20,
  },
});

export default Teams;

