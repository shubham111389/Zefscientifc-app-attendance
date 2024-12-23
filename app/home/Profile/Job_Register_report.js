import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Title } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { API_URL_FOR_JOB_REGISTER_POST } from '@env';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const Job_Register_Report = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [jobRegisterData, setJobRegisterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [employeeName, setEmployeeName] = useState('Name');

  // All your existing useEffect hooks and functions remain the same
  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('@user_data');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setEmployeeName(`${userData.firstName} ${userData.lastName}`);
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL_FOR_JOB_REGISTER_POST);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          setLoading(false);
        }
        const result = await response.json();
        setJobRegisterData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const goToPrevDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    setDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };

  useEffect(() => {
    const formattedSelectedDate = formatDate(date);
    const filtered = jobRegisterData.filter((job) => {
      const jobDate = formatDate(new Date(job.Date));
      const dateMatch = jobDate === formattedSelectedDate;
      const nameMatch = job.EmployeeName.trim().toLowerCase() === employeeName.trim().toLowerCase();
      return dateMatch && nameMatch;
    });
    setFilteredData(filtered);
  }, [date, jobRegisterData, employeeName]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        goToPrevDay();
      } else if (gestureState.dx < 0) {
        goToNextDay();
      }
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <View style={styles.header}>
        <Title style={styles.title}>𝙹𝙾𝙱 𝚁𝙴𝙶𝙸𝚂𝚃𝙴𝚁 𝚁𝙴𝙿𝙾𝚁𝚃</Title>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={goToPrevDay}>
            <AntDesign name="left" size={28} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextDay}>
            <AntDesign name="right" size={28} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {filteredData.length > 0 ? (
        filteredData.map((job, index) => (
          <View key={index} style={styles.expenseContainer}>
            <Text style={styles.expenseKey}>Working Status:</Text>
            <Text style={styles.expenseValue}>{job.WorkingStatus || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Visit Type:</Text>
            <Text style={styles.expenseValue}>{job.VisitType || 'N/A'}</Text>
            <Text style={styles.expenseKey}>City:</Text>
            <Text style={styles.expenseValue}>{job.City || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Customer:</Text>
            <Text style={styles.expenseValue}>{job.Customer || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Contact Person:</Text>
            <Text style={styles.expenseValue}>{job.ContactPerson || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Job Type:</Text>
            <Text style={styles.expenseValue}>{job.JobType || 'N/A'}</Text>
            <Text style={styles.expenseKey}>KM for Petrol Expenses:</Text>
            <Text style={styles.expenseValue}>{job.KMForPetrolExpenses || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Instrument Model:</Text>
            <Text style={styles.expenseValue}>{job.Instrument || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Serial No:</Text>
            <Text style={styles.expenseValue}>{job.SerialNo || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Accompanied By:</Text>
            <Text style={styles.expenseValue}>{job.AccompaniedBy || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Details Of Works :</Text>
            <Text style={styles.expenseValue}>{job.DetailsOfWorks || 'N/A'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Heyy! {employeeName}, no Job Register were recorded for this date. Check back later for any updates.</Text>
      )}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // White text for dark theme
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#ffffff', // White text for dark theme
  },
  expenseContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#1E1E1E', // Darker container for expense details
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#333333',
    borderWidth: 1,
  },
  expenseKey: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db', // Light blue for keys
    marginBottom: 4,
  },
  expenseValue: {
    fontSize: 16,
    marginBottom: 12,
    color: '#ffffff', // White text for values
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888888', // Gray text for no data message
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b', // Red color for error text
    textAlign: 'center',
  },
});

export default Job_Register_Report;