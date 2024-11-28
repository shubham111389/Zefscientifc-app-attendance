import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Title } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { API_URL_FOR_EXPENSE_POST } from '@env'; // Ensure you have this in your .env file
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

// Helper function to format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const ExpenseReport = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [allExpenseData, setAllExpenseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [employeeName, setEmployeeName] = useState('Name');

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

  // Fetch user data on component mount
  useEffect(() => {
    getUserData();
  }, []);

  // Set EmployeeName after userData is updated
  useEffect(() => {
    if (userData) {
      console.log( userData);
      setEmployeeName(`${userData.firstName} ${userData.lastName}`);
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL_FOR_EXPENSE_POST);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          setLoading(false);
        }
        const result = await response.json();
        setAllExpenseData(result.data);
        console.log( result);
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
    

    const filtered = allExpenseData.filter((expense) => {
      console.log( expense);
        const expenseDate = formatDate(new Date(expense.DateAndDay));
        const dateMatch = expenseDate === formattedSelectedDate;
        const nameMatch = expense.EmployeeName.trim().toLowerCase() === employeeName.trim().toLowerCase();

        console.log(`Expense Date: ${expenseDate}, Selected Date: ${formattedSelectedDate}, Are Dates Equal: ${dateMatch}`);
        console.log(`Expense EmployeeName: ${expense}, Filter EmployeeName: ${employeeName}, Are Names Equal: ${nameMatch}`);
        
        return dateMatch && nameMatch;
    });

    setFilteredData(filtered);
    console.log("Filtered Data: ", filtered);
}, [date, allExpenseData, employeeName]);


  // PanResponder to detect swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20, // Detect swipe with horizontal movement
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        goToPrevDay(); // Swiped right, go to the previous day
      } else if (gestureState.dx < 0) {
        goToNextDay(); // Swiped left, go to the next day
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
      {...panResponder.panHandlers} // Attach the PanResponder to the ScrollView
    >
      <View style={styles.header}>
        <Title style={styles.title}>𝙴𝚇𝙿𝙴𝙽𝚂𝙴𝚂 𝚁𝙴𝙿𝙾𝚁𝚃𝚂</Title>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={goToPrevDay}>
            <AntDesign name="left" size={28} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextDay}>
            <AntDesign name="right" size={28} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Display the filtered expense data */}
      {filteredData.length > 0 ? (
        filteredData.map((expense, index) => (
          <View key={index} style={styles.expenseContainer}>
            <Text style={styles.expenseKey}>Category:</Text>
            <Text style={styles.expenseValue}>{expense.Category || 'N/A'}</Text>
            <Text style={styles.expenseKey}>City:</Text>
            <Text style={styles.expenseValue}>{expense.City || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Expense Type:</Text>
            <Text style={styles.expenseValue}>{expense.ExpenseType || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Amount:</Text>
            <Text style={styles.expenseValue}>{expense.Amount || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Description:</Text>
            <Text style={styles.expenseValue}>{expense.Description || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Bill Submitted:</Text>
            <Text style={styles.expenseValue}>{expense.BillSubmitted || 'N/A'}</Text>
            <Text style={styles.expenseKey}>KM for Petrol Expenses:</Text>
            <Text style={styles.expenseValue}>{expense.KMForPetrolExpenses || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Reference for KM Calculation:</Text>
            <Text style={styles.expenseValue}>{expense.ReferenceForKMCalculation || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Details or Remarks:</Text>
            <Text style={styles.expenseValue}>{expense.DetailsOrRemarks || 'N/A'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Heyy! {employeeName}, no expenses were recorded for this date. Check back later for any updates.</Text>
      )}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Light background color
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Darker text color
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

  },
  expenseContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#F0FFF0', // White background for expense details
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  expenseKey: {
    fontSize: 16,
    fontWeight: 'bold', // Bold style for field keys
    color: '#333',
  },
  expenseValue: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555', // Softer text color for expense values
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ExpenseReport;
