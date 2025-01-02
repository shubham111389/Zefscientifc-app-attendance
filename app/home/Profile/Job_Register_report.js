import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, PanResponder, Alert, Platform } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import { API_URL_FOR_JOB_REGISTER_POST} from '@env';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import CustomAlert from './CustomAlert';

import OfflineComponent from './OfflineComponent';
import useOnline from '../../../Hooks/useOnline';



const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const getWorkingStatusColor = (status) => {
  switch(status?.trim()) {
    case 'Working': return '#2ECC71';
    case 'Holiday': return '#F39C12';
    case 'Leave': return '#E74C3C';
    case 'Week Off': return '#3498DB';
    default: return '#95A5A6';
  }
};

const getWorkingStatusIcon = (status) => {
  switch(status?.trim()) {
    case 'Working': return 'work';
    case 'Holiday': return 'celebration';
    case 'Leave': return 'event-busy';
    case 'Week Off': return 'weekend';
    default: return 'work-off';
  }
};

const DetailRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={20} color="#3498DB" />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
};

const JobCard = ({ job }) => {
  const statusColor = getWorkingStatusColor(job.WorkingStatus);
  const statusIcon = getWorkingStatusIcon(job.WorkingStatus);

  return (
    <View style={styles.jobCard}>
      <View style={styles.cardContent}>
        <View style={[
          styles.statusBadge,
          { 
            backgroundColor: `${statusColor}15`,
            borderColor: `${statusColor}30`
          }
        ]}>
          <MaterialIcons 
            name={statusIcon} 
            size={20} 
            color={statusColor} 
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {job.WorkingStatus || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailSection}>
          <DetailRow icon="directions" label="Visit Type" value={job.VisitType} />
          <DetailRow icon="location-city" label="City" value={job.City} />
          <DetailRow icon="business" label="Customer" value={job.Customer} />
          <DetailRow icon="person" label="Contact Person" value={job.ContactPerson} />
          <DetailRow icon="category" label="Job Type" value={job.JobType} />
          <DetailRow icon="directions-car" label="KM for Petrol" value={job.KMForPetrolExpenses} />
          <DetailRow icon="build" label="Instrument Model" value={job.Instrument} />
          <DetailRow icon="category" label="Job Code" value={job.JobCode} />
          <DetailRow icon="tag" label="Serial No" value={job.SerialNo} />
          <DetailRow icon="group" label="Accompanied By" value={job.AccompaniedBy} />
          <DetailRow icon="description" label="Details Of Works" value={job.DetailsOfWorks} />
        </View>
      </View>
    </View>
  );
};

const EmptyState = ({ employeeName, date }) => (
  <View style={styles.emptyState}>
    <MaterialIcons name="work-off" size={70} color="#3498DB" style={styles.emptyIcon} />
    <Text style={styles.emptyTitle}>No Job Records Found</Text>
    <Text style={styles.emptyDescription}>
      Hey {employeeName}! No job register entries were recorded for {formatDate(date)}.
    </Text>
  </View>
);

const Job_Register_Report = () => {
  
  
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [jobRegisterData, setJobRegisterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState('Name');
  const [downloading, setDownloading] = useState(false);
  const isOnline = useOnline();

  const [alert, setAlert] = useState({
        visible: false,
        type: 'success',
        title: '',
        message: ''
      });



  const showAlert = (type, title, message) => {
        setAlert({
          visible: true,
          type,
          title,
          message
        });
      };
    
  const hideAlert = () => {
        setAlert(prev => ({ ...prev, visible: false }));
      
      };
        
      const saveFile = async (uri, filename, mimetype) => {
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
            showAlert('error', 'Error', 'Failed to save file');
          }
        } else {
          await shareAsync(uri);
        }
      };


  const downloadReport = async () => {
    setDownloading(true);
    const filename = `job-register-${formatDate(date)}.pdf`;
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYE9BrUw9anZCtUI83gwtqlY5YfRbwxH-K9wrdR-Q9mRLsxf5JzhfYj68l3UutMpxKFrWuga8C-SLh/pub?gid=1527031786&single=true&output=pdf';
    
    try {
      const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + filename
      );
      await saveFile(result.uri, filename, 'application/pdf');
    } catch (error) {
      console.error('Download error:', error);
      showAlert('error', 'Error', 'Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

 
  useEffect(() => {
    const fetchJobRegisterData = async () => {
      if (!isOnline) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL_FOR_JOB_REGISTER_POST);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setJobRegisterData(result.data || []);
      } catch (error) {
        console.error('Error fetching job register data:', error);
        setError('Failed to fetch job register data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRegisterData();
  }, [isOnline]);
      
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



  useEffect(() => {
    const formattedSelectedDate = formatDate(date);
    const filtered = jobRegisterData.filter(job => {
      const jobDate = formatDate(new Date(job.Date));
      return jobDate === formattedSelectedDate && 
             job.EmployeeName.trim().toLowerCase() === employeeName.trim().toLowerCase();
    });
    setFilteredData(filtered);
  }, [date, jobRegisterData, employeeName]);



  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 0) setDate(d => new Date(d.setDate(d.getDate() - 1)));
      else if (gestureState.dx < 0) setDate(d => new Date(d.setDate(d.getDate() + 1)));
    },
  });

  if (!isOnline) return <OfflineComponent />;
  if (isLoading) return <LoadingScreen />;
  if (error) return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0F1B2C", "#172435"]} style={styles.gradientBackground}>
        <ScrollView style={styles.scrollView} {...panResponder.panHandlers}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <MaterialIcons name="work" size={28} color="#3498DB" />
                <Text style={styles.headerTitle}>Job Register Report</Text>
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
              <TouchableOpacity 
                onPress={() => setDate(d => new Date(d.setDate(d.getDate() - 1)))} 
                style={styles.dateButton}
              >
                <AntDesign name="left" size={24} color="#3498DB" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setDatePickerVisibility(true)} 
                style={styles.dateDisplay}
              >
                <MaterialIcons name="event" size={20} color="#3498DB" />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setDate(d => new Date(d.setDate(d.getDate() + 1)))} 
                style={styles.dateButton}
              >
                <AntDesign name="right" size={24} color="#3498DB" />
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(selectedDate) => {
              setDate(selectedDate);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          {filteredData.length > 0 ? (
            filteredData.map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          ) : (
            <EmptyState employeeName={employeeName} date={date} />
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
  jobCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#172435',
    borderWidth: 1,
    borderColor: '#2C3E50',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  detailSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 120,
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

export default Job_Register_Report;