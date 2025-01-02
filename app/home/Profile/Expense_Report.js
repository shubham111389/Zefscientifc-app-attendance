

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder, Platform } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import { API_URL_FOR_EXPENSE_POST,API_FOR_EXPENSE_SHEET } from '@env';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import CustomAlert from './CustomAlert';
import OfflineComponent from './OfflineComponent';
import useOnline from '../../../Hooks/useOnline';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const ExpenseReport = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState('Name');
  const [downloading, setDownloading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const isOnline = useOnline();

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setAlert({ visible: true, type, title, message });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user_data');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setEmployeeName(`${parsedUserData.firstName} ${parsedUserData.lastName}`);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      }
    };

    loadUserData();
  }, []);

  // Fetch expense data
  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!isOnline) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL_FOR_EXPENSE_POST);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.data) {
          throw new Error('No data received from server');
        }
        
        // Parse the data if it's a string, otherwise use it directly
        const parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        setExpenseData(parsedData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
        setError('Failed to fetch expense data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseData();
  }, [isOnline]);


  useEffect(() => {
    if (!expenseData.length) return;

    const formattedSelectedDate = formatDate(date);
    const filtered = expenseData.filter((expense) => {
      try {
        const expenseDate = formatDate(new Date(expense.DateAndDay));
        return expenseDate === formattedSelectedDate && 
               expense.EmployeeName.trim().toLowerCase() === employeeName.trim().toLowerCase();
      } catch (error) {
        console.error('Error filtering expense:', error);
        return false;
      }
    });
    setFilteredData(filtered);
  }, [date, expenseData, employeeName]);

  const downloadReport = async () => {
    setDownloading(true);
    const filename = `expense-report-${formatDate(date)}.pdf`;
    const url = API_FOR_EXPENSE_SHEET;
    
    try {
      const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + filename
      );
      await saveFile(result.uri, filename);
    } catch (error) {
      console.error('Download error:', error);
      showAlert('error', 'Error', 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const saveFile = async (uri, filename) => {
    if (Platform.OS === "android") {
      try {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            'application/pdf'
          );
          
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          showAlert('success', 'Success', 'PDF downloaded successfully');
        } else {
          showAlert('error', 'Permission Required', 'You need to grant permission to save files');
        }
      } catch (error) {
        showAlert('error', 'Error', 'Failed to save PDF');
      }
    } else {
      await shareAsync(uri);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 0) {
        setDate(d => new Date(d.setDate(d.getDate() - 1)));
      } else if (gestureState.dx < 0) {
        setDate(d => new Date(d.setDate(d.getDate() + 1)));
      }
    },
  });

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



  const getExpenseTypeColor = (type) => {
    switch(type?.trim().toLowerCase()) {
      case 'da outstation': return '#3498DB';
      case 'transportation': return '#E74C3C';
      case 'communication': return '#F39C12';
      default: return '#2ECC71';
    }
  };

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

  if (!isOnline) return <OfflineComponent />;
  if (isLoading) return <LoadingScreen />;
  
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
        <ScrollView style={styles.scrollView} {...panResponder.panHandlers}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <MaterialIcons name="receipt-long" size={28} color="#3498DB" />
                <Text style={styles.headerTitle}>Expense Report</Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={downloadReport}
                disabled={downloading}
              >
                <MaterialIcons 
                  name="file-download" 
                  size={18} 
                  color={downloading ? "#BDC3C7" : "#3498DB"} 
                />
                <Text style={[
                  styles.downloadText,
                  { color: downloading ? "#BDC3C7" : "#3498DB" }
                ]}>
                  {downloading ? "Downloading..." : "Download"}
                </Text>
              </TouchableOpacity>
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

        <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
      />

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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ECF0F1',
    marginLeft: 10,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172435',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C3E50',
  },
  downloadText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
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