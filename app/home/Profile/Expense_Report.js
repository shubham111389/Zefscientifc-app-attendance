import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Title } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { API_URL_FOR_EXPENSE_POST } from '@env';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import { useLocalSearchParams } from 'expo-router';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const ExpenseReport = () => {
  const {  expenseData} = useLocalSearchParams();
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
        setLoading(false);
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
      const result= JSON.parse(expenseData);
      setAllExpenseData(result);
  
  
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
      console.log( expense.DateAndDay)
      const expenseDate = formatDate(new Date(expense.DateAndDay));
      console.log(expenseDate);
      const dateMatch = expenseDate === formattedSelectedDate;
      console.log( dateMatch);
    
      const nameMatch = expense.EmployeeName.trim().toLowerCase() === employeeName.trim().toLowerCase();
      console.log(nameMatch);
      return dateMatch && nameMatch;
    });
    setFilteredData(filtered);
  }, [date, allExpenseData, employeeName]);
  console.log( filteredData);

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
        <Title style={styles.title}>𝙴𝚇𝙿𝙴𝙽𝚂𝙴 𝚁𝙴𝙿𝙾𝚁𝚃</Title>
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
        filteredData.map((expense, index) => (
          <View key={index} style={styles.expenseContainer}>
            <Text style={styles.expenseKey}>Expense Type:</Text>
            <Text style={styles.expenseValue}>{expense.ExpenseType || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Amount:</Text>
            <Text style={styles.expenseValue}>{expense.Amount || 'N/A'}</Text>
            <Text style={styles.expenseKey}>City:</Text>
            <Text style={styles.expenseValue}>{expense.City || 'N/A'}</Text>
            <Text style={styles.expenseKey}>Description:</Text>
            <Text style={styles.expenseValue}>{expense.Description || 'N/A'}</Text>
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
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
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
    color: '#ffffff',
  },
  expenseContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#1E1E1E',
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
    color: '#3498db',
    marginBottom: 4,
  },
  expenseValue: {
    fontSize: 16,
    marginBottom: 12,
    color: '#ffffff',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ExpenseReport;
