import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { expenseData } = useLocalSearchParams();
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



  

  const renderExpenseDetail = (icon, label, value) => {
    if (!value || value === 'N/A') return null;
    
    return (
      <View style={styles.detailRow}>
        <MaterialIcons name={icon} size={20} color="#6264A7" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>{label}:</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      </View>
    );
  };

  const getExpenseTypeColor = (type) => {
    switch(type?.trim().toLowerCase()) {
      case 'da outstation':
        return '#3498DB'; // Changed to match home theme blue
      case 'transportation':
        return '#E74C3C'; // Changed to match home theme red
      case 'communication':
        return '#F39C12'; // Changed to match home theme orange
      default:
        return '#2ECC71'; // Changed to match home theme green
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={["#0F1B2C", "#172435"]} 
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <MaterialIcons name="receipt-long" size={28} color="#3498DB" />
              <Text style={styles.headerTitle}>Expense Report</Text>
            </View>
            
            <View style={styles.dateNavigator}>
              <TouchableOpacity onPress={goToPrevDay} style={styles.dateButton}>
                <AntDesign name="left" size={24} color="#3498DB" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={showDatePicker} style={styles.dateDisplay}>
                <MaterialIcons name="event" size={20} color="#3498DB" />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={goToNextDay} style={styles.dateButton}>
                <AntDesign name="right" size={24} color="#3498DB" />
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
              <View key={index} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: `${getExpenseTypeColor(expense.ExpenseType)}20` }]}>
                      <View style={[styles.typeDot, { backgroundColor: getExpenseTypeColor(expense.ExpenseType) }]} />
                      <Text style={[styles.typeText, { color: getExpenseTypeColor(expense.ExpenseType) }]}>
                        {expense.ExpenseType || 'N/A'}
                      </Text>
                    </View>
                    
                    <View style={styles.amountBadge}>
                      <MaterialIcons name="attach-money" size={16} color="#3498DB" />
                      <Text style={styles.amountText}>₹{expense.Amount}</Text>
                    </View>
                  </View>

                  {renderExpenseDetail("location-city", "City", expense.City)}
                  {renderExpenseDetail("description", "Description", expense.Description)}
                  {renderExpenseDetail("category", "Category", expense.Category)}
                  {expense.KMForPetrolExpenses && renderExpenseDetail("directions-car", "KM for Petrol", expense.KMForPetrolExpenses)}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={70} color="#3498DB" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Expenses Found</Text>
              <Text style={styles.emptyDescription}>
                Hey {employeeName}! No expenses were recorded for {formatDate(date)}.
              </Text>
            </View>
          )}
          <Footer />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1B2C'
  },
  gradientBackground: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3E50',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ECF0F1',
    marginLeft: 10,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#172435',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172435',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  dateText: {
    color: '#ECF0F1',
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#172435',
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1B2C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amountText: {
    color: '#ECF0F1',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailContent: {
    flexDirection: 'row',
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    color: '#ECF0F1',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  detailValue: {
    color: '#BDC3C7',
    fontSize: 14,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#172435',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C3E50',
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ECF0F1',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ExpenseReport;