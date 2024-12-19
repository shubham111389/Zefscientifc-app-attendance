import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text,Alert } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {  AntDesign,  FontAwesome,  } from "@expo/vector-icons";
import { useForm, Controller } from 'react-hook-form';
import {API_URL_FOR_JOB_REGISTER_POST} from "@env"
import { Dropdown } from 'react-native-element-dropdown';
import LoadingScreen from './LoadingScreen';
import useOnline from '../../../Hooks/useOnline';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDropdownData from '../../../Hooks/useDropdownData';

const JobRegisterReport = () => {
  const isOnline = useOnline(); 
  const router = useRouter();
  const { dropdownOptions, loading, error } = useDropdownData();
  

  const { control, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isLoading, setIsLoading] = useState(true);   
  const [isDropdown, setIsDropdown] = useState(); 

  const [userData, setUserData] = useState(null); 

  const [EmployeeName,setEmployeeName]=useState('name'); 
  const [workingStatus, setWorkingStatus] = useState('Working ');
  const [ visitType,setVisitType]=useState('office');
  // State to store AsyncStorage dataconst

  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('@user_data');
      console.log('User data from AsyncStorage:', data);
      if (data) {
        setUserData(JSON.parse(data)); // Update userData state
      } else {  
        console.log('No user data found in AsyncStorage');
      }
    } catch (error) {
      console.log('Error fetching user data from AsyncStorage:', error);
    }
  };
  
  // useEffect to fetch user data on component mount
  useEffect(() => {
    getUserData();
  }, []);
  
  // New useEffect to set EmployeeName after userData is updated
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
      setEmployeeName(`${userData.firstName} ${userData.lastName}`); // Concatenate first and last names
    }
  }, [userData]); // Trigger when userData is updated
  
  console.log("Employee Name:", EmployeeName);

 
  const onSubmit = async (data) => {
    console.log( data);
    const formDatab = new FormData();
    console.log(date.toDateString());
    formDatab.append('Date',date.toDateString());
    formDatab.append('EmployeeName', EmployeeName);
    formDatab.append('WorkingStatus', data.WorkingStatus);
    formDatab.append('VisitType', data.VisitType);
    formDatab.append('City', data.City);
    formDatab.append('Customer', data.Customer);
    formDatab.append('ContactPerson', data.ContactPerson);
    formDatab.append('JobType', data.JobType);
    formDatab.append('Instrument', data.Instrument);
    formDatab.append('SerialNo', data.SerialNo);
    formDatab.append('JobCode', data.JobCode);
    formDatab.append('AccompaniedBy', data.AccompaniedBy);
    

    formDatab.append('DetailsOfWorks', data.DetailsOfWorks  );


    console.log("Submitted Form Data: ", formDatab);

    try {
      const response = await fetch(API_URL_FOR_JOB_REGISTER_POST, {
        method: 'POST',
        body: formDatab,
      });
    
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log(result);
        Alert.alert('Success', 'Your Job Register submitted successfully!');
      } else {
        const result = await response.text();
        console.log('Response is not JSON:', result);
        Alert.alert('Success', 'Your Job Register submitted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit the form.');
    }
  
  
  };

  const handleAddAnotherExpense = async (data) => {
    setIsLoading(true);
    await onSubmit(data); 
    setIsLoading(false);// Wait for form submission to complete
    router.push('./Mark_Expense_Report'); // Navigate after form submission is done
  };

  useEffect(() => {
    if (dropdownOptions) {
     
      setIsDropdown(dropdownOptions[0]);
      
      console.log( dropdownOptions[0]);
       // Stop loading once user data is available
    }
  }, [dropdownOptions]);
// Loading state
useEffect(() => {
  if (isDropdown) {
    setIsLoading(false);
   
   
     // Stop loading once user data is available
  }
}, [isDropdown]);

  
 if (!isOnline) {
  return <OfflineComponent />;
 }

  if (isLoading) {
    return <LoadingScreen />;
  }

//W
  const Working_StatusOptions= isDropdown?.Working_Status?.map((category) => ({
    label: category,
    value: category
  })) || [];
  
  //
  const Visit_Type_dropdownoptions = isDropdown?.Visit_Type?.map((type) => ({
    label: type,
    value: type
  })) || [];
  
  
  const cityOptions = isDropdown?.City?.map((city) => ({
    label: city,
    value: city
   
  })) || [];
  
  const CustomerOptions = isDropdown?.["Customer "]?.map((type) => ({
    label: type,
    value: type,
  })) || [];
  

  
  const Job_Type_Options=isDropdown?.Job_Type?.map((type) => ({
    label: type,
    value: type
  })) || [];

  

  //Instrument
  const Instrument_Options=isDropdown?.["Instrument "]?.map((type) => ({
    label: type,
    value: type
  })) || [];

  const Accompanied_by_Options=isDropdown?.Accompanied_by?.map((type) => ({
    label: type,
    value: type
  })) || [];
 
  
  

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

  const formatDate = (date) => {
   
    return date.toDateString();

  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>𝙹𝙾𝙱 𝚁𝙴𝙶𝙸𝚂𝚃𝙴𝚁 𝚂𝚄𝙱𝙼𝙸𝚂𝚂𝙸𝙾𝙽</Title>

        <View style={styles.dateContainer}>
          <AntDesign onPress={goToPrevDay} name="left" size={24} color="#3498DB" />
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <AntDesign onPress={goToNextDay} name="right" size={24} color="#3498DB" />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.form}>
        <Controller
          control={control}
          name="WorkingStatus"
          rules={{ required: 'Working Status is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
              <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                <Dropdown
                  style={[styles.dropdown]}
                  selectedTextStyle={styles.inputText}
                  inputSearchStyle={styles.searchInput}
                  iconStyle={styles.iconStyle}
                  data={Working_StatusOptions}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={value ? '' : 'Working Status'}
                  searchPlaceholder="Working Status"
                  value={value}
                  onBlur={onBlur}
                  onChange={(item) => {
                    onChange(item.value);
                    setWorkingStatus(item.value);
                  }}
                  placeholderStyle={styles.placeholderText}
                />
                {value && <Text style={styles.floatingLabel}>Working Status</Text>}
              </View>
              {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
            </>
          )}
        />

        {workingStatus === 'Working ' && (
          <Controller
            control={control}
            name="VisitType"
            rules={{ required: 'Visit Type is required' }}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
              <>
                <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                  <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.inputText}
                    inputSearchStyle={styles.searchInput}
                    iconStyle={styles.iconStyle}
                    data={Visit_Type_dropdownoptions}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="Visit Type"
                    searchPlaceholder="Visit Type"
                    value={value}
                    onBlur={onBlur}
                    onChange={(item) => {
                      onChange(item.value);
                      setVisitType(item.value);
                    }}
                    placeholderStyle={styles.placeholderText}
                  />
                  {value && <Text style={styles.floatingLabel}>Visit Type</Text>}
                </View>
                {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
              </>
            )}
          />
        )}

        {workingStatus === 'Working ' && visitType === 'Outstation ' && (
          <Controller
            control={control}
            name="City"
            rules={{ required: 'City is required' }}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
              <>
                <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                  <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.inputText}
                    inputSearchStyle={styles.searchInput}
                    iconStyle={styles.iconStyle}
                    data={cityOptions}
                    search
                    labelField="label"
                    valueField="value"
                    placeholder="City"
                    searchPlaceholder="City"
                    value={value}
                    onBlur={onBlur}
                    onChange={(item) => onChange(item.value)}
                    placeholderStyle={styles.placeholderText}
                  />
                  {value && <Text style={styles.floatingLabel}>City</Text>}
                </View>
                {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
              </>
            )}
          />
        )}

        {workingStatus === 'Working ' && visitType !== 'WFH ' && visitType !== 'Office' && (
          <>
            <Controller
              control={control}
              name="Customer"
              rules={{ required: 'Customer is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <>
                  <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.inputText}
                      inputSearchStyle={styles.searchInput}
                      iconStyle={styles.iconStyle}
                      data={CustomerOptions}
                      search
                      labelField="label"
                      valueField="value"
                      placeholder="Customer"
                      searchPlaceholder="Customer"
                      value={value}
                      onBlur={onBlur}
                      onChange={(item) => onChange(item.value)}
                      placeholderStyle={styles.placeholderText}
                    />
                    {value && <Text style={styles.floatingLabel}>Customer</Text>}
                  </View>
                  {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
                </>
              )}
            />

            <Controller
              control={control}
              name="ContactPerson"
              rules={{ required: 'Contact Person is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Contact Person"
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.input}
                    theme={styles.textInputTheme}
                  />
                  {errors.ContactPerson && (
                    <HelperText type="error" style={styles.errorText}>
                      {errors.ContactPerson.message}
                    </HelperText>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="JobType"
              rules={{ required: 'Job Type is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <>
                  <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.inputText}
                      inputSearchStyle={styles.searchInput}
                      iconStyle={styles.iconStyle}
                      data={Job_Type_Options}
                      search
                      labelField="label"
                      valueField="value"
                      placeholder="Job Type"
                      searchPlaceholder="Job Type"
                      value={value}
                      onBlur={onBlur}
                      onChange={(item) => onChange(item.value)}
                      placeholderStyle={styles.placeholderText}
                    />
                    {value && <Text style={styles.floatingLabel}>Job Type</Text>}
                  </View>
                  {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
                </>
              )}
            />

            <Controller
              control={control}
              name="Instrument"
              rules={{ required: 'Instrument is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <>
                  <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.inputText}
                      inputSearchStyle={styles.searchInput}
                      iconStyle={styles.iconStyle}
                      data={Instrument_Options}
                      search
                      labelField="label"
                      valueField="value"
                      placeholder="Instrument Model"
                      searchPlaceholder="Instrument Model"
                      value={value}
                      onBlur={onBlur}
                      onChange={(item) => onChange(item.value)}
                      placeholderStyle={styles.placeholderText}
                    />
                    {value && <Text style={styles.floatingLabel}>Instrument Model</Text>}
                  </View>
                  {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
                </>
              )}
            />

            <Controller
              control={control}
              name="SerialNo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Serial No"
                  mode="outlined"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  theme={styles.textInputTheme}
                />
              )}
            />

            <Controller
              control={control}
              name="JobCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Job Code"
                  mode="outlined"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  theme={styles.textInputTheme}
                />
              )}
            />

            <Controller
              control={control}
              name="AccompaniedBy"
              rules={{ required: 'Accompanied by is required' }}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <>
                  <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.inputText}
                      inputSearchStyle={styles.searchInput}
                      iconStyle={styles.iconStyle}
                      data={Accompanied_by_Options}
                      search
                      labelField="label"
                      valueField="value"
                      placeholder="Accompanied by"
                      searchPlaceholder="Accompanied by"
                      value={value}
                      onBlur={onBlur}
                      onChange={(item) => onChange(item.value)}
                      placeholderStyle={styles.placeholderText}
                    />
                    {value && <Text style={styles.floatingLabel}>Accompanied by</Text>}
                  </View>
                  {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
                </>
              )}
            />
          </>
        )}

        <Controller
          control={control}
          name="DetailsOfWorks"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Details / Remarks"
              mode="outlined"
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              theme={styles.textInputTheme}
            />
          )}
        />

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          style={styles.button}
          buttonColor="#3498DB"
        >
          Submit
        </Button>

        <Button 
          mode="outlined" 
          onPress={handleSubmit(handleAddAnotherExpense)} 
          style={styles.button}
          textColor="#3498DB"
        >
          Add Another Expense
        </Button>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          If you have any issues or need further assistance, please contact us at
          <Text style={styles.contactEmail}> a.shubham@zefsci.com</Text>
        </Text>
      </View>

      <View style={styles.socialIconsContainer}>
        <FontAwesome name="facebook" size={24} color="#3498DB" style={styles.icon} />
        <FontAwesome name="twitter" size={24} color="#3498DB" style={styles.icon} />
        <FontAwesome name="linkedin" size={24} color="#3498DB" style={styles.icon} />
        <FontAwesome name="instagram" size={24} color="#3498DB" style={styles.icon} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F1B2C',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECF0F1',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: -2,
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#ECF0F1',
  },
  form: {
    marginBottom: 20,
  },
  // Input container for both Dropdown and TextInput
  inputContainer: {
    position: 'relative',
    borderColor: '#3498DB',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#172435',
    
  },
  // Style for focused state of inputs
  focusedInput: {
    marginTop: 10,
    borderColor: '#3498DB',
    borderWidth: 2,
  },
  // Text styling for input values
  inputText: {
    fontSize: 16,
    color: '#ECF0F1',
  },
  // Placeholder text styling
  placeholderText: {
    color: '#7F8C8D',
  },
  // Search input styling for dropdowns
  searchInput: {
    height: 40,
    fontSize: 16,
    color: '#ECF0F1',
    backgroundColor: '#172435',
  },
  // Dropdown specific styling
  dropdown: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#172435',
  },
  // Floating label styling
  floatingLabel: {
    position: 'absolute',
    left: 8,
    top: -10,
    backgroundColor: '#0F1B2C',
    paddingHorizontal: 4,
    fontSize: 14,
    fontWeight: '400',
    color: '#3498DB',
  },
  // TextInput specific styling
  input: {
    marginBottom: 12,
    backgroundColor: '#172435',
    borderColor: 'transparent',
    color: '#ECF0F1',
  },
  // Error text styling
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 4,
    color: '#E74C3C',
  },
  // Icon styling
  iconStyle: {
    width: 20,
    height: 20,
  },
  // Button styling
  button: {
    marginVertical: 14,
  },
  // Contact section styling
  contactContainer: {
    marginTop: 3,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ECF0F1',
  },
  contactEmail: {
    color: '#3498DB',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Social icons styling
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  // Theme configuration for TextInput components
  textInputTheme: {
    colors: {
      primary: '#3498DB',      // Primary color for focus state
      text: '#ECF0F1',         // Text color
      placeholder: '#7F8C8D',   // Placeholder text color
      background: '#172435',    // Background color
      surface: '#172435',       // Surface color
      outlineVariant: '#3498DB' // Border color
    },
  },
});

export default JobRegisterReport;