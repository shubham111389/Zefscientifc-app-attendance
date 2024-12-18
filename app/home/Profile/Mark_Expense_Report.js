import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text,Alert } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {  AntDesign,  FontAwesome,  } from "@expo/vector-icons";
import { useForm, Controller } from 'react-hook-form';
import {API_URL_FOR_EXPENSE_POST} from "@env"
import { Dropdown } from 'react-native-element-dropdown';
import useDropdownData from '../../../Hooks/useDropdownData';
import LoadingScreen from './LoadingScreen';
import useOnline from '../../../Hooks/useOnline';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseForm = () => {
  const isOnline = useOnline(); 
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const { dropdownOptions, loading, error } = useDropdownData();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isLoading, setIsLoading] = useState(true);  
  const [isDropdown, setIsDropdown] = useState();  
  const [userData, setUserData] = useState(null); 

  const [EmployeeName, setEmployeeName] = useState("name");

  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('@user_data');
      console.log( data );
      console.log('User data from AsyncStorage:', data);
      if (data) {
        setUserData(JSON.parse(data));
        console.log(userData); // Update userData state
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
      setEmployeeName(`${userData.firstName} ${userData.lastName}`); // Concatenate first and last names
    }
  }, [userData]);
   // Trigger when userData is updated
 
  console.log("Employee Name:", EmployeeName);

  const onSubmit = async (data) => {
    const formDatab = new FormData();
    formDatab.append('DateAndDay', data.DateDateAndDay || date.toDateString());
    formDatab.append('EmployeeName', EmployeeName);
    console.log ( EmployeeName);

    formDatab.append('Category', data.Category);
    formDatab.append('City', data.City);
    formDatab.append('ExpenseType', data.ExpenseType);
    formDatab.append('Amount', data.Amount);
    formDatab.append('Description', data.Description);
    formDatab.append('BillSubmitted', data.BillSubmitted);
    formDatab.append('KMForPetrolExpenses', data.KMForPetrolExpenses);
    formDatab.append('ReferenceForKMCalculation', data.ReferenceForKMCalculation);
    formDatab.append('DetailsOrRemarks', data.DetailsOrRemarks);

    console.log("Submitted Form Data: ", formDatab);
    
    try {
      const response = await fetch(API_URL_FOR_EXPENSE_POST, {
        method: 'POST',
        body: formDatab,
      });
    
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log(result);
        Alert.alert('Success', 'Your Expense submitted successfully!');
      } else {
        const result = await response.text();
        console.log('Response is not JSON:', result);
        Alert.alert('Success', 'Your Expense submitted successfully!');
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
     
      setIsDropdown(dropdownOptions[0])
       // Stop loading once user data is available
    }
  }, [dropdownOptions]);

  useEffect(() => {
    if (isDropdown) {
      setIsLoading(false);
     
       // Stop loading once user data is available
    }
  }, [isDropdown]);
// Loading state

  
 if (!isOnline) {
  return <OfflineComponent />;
 }

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log(isDropdown);
 

   // Transform the data1 to dropdown format
   const categoryOptions = isDropdown.Category.map((category) => ({
    label: category,
    value: category
  }));
  
  const expenseTypeOptions = isDropdown.Expense_Type.map((type) => ({
    label: type,
    value: type
  }));
  
  
  
const cityOptions = isDropdown.City.map((city) => ({
    label: city,
    value: city
  }));
   
const BillSubmittedOptions = isDropdown.Bill_submitted.map((type) => ({
    label: type,
    value: type
  }));
   
  
  
  

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
        <Title style={styles.title}>𝙴𝚇𝙿𝙴𝙽𝚂𝙴 𝚁𝙴𝙿𝙾𝚁𝚃 𝚂𝚄𝙱𝙼𝙸𝚂𝚂𝙸𝙾𝙽</Title>

        <View style={styles.dateContainer}>
          <AntDesign onPress={goToPrevDay} name="left" size={24} color="#6200ee" />
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <AntDesign onPress={goToNextDay} name="right" size={24} color="#6200ee" />
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
  name="Category"
  rules={{ required: 'Category is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown} // Apply consistent styling
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categoryOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={value ? '' : 'Category'} // Float placeholder when value exists
          searchPlaceholder="Category"
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
            console.log(`Selected Item: ${item.label}`);
          }}
        />
        {/* Floating label effect */}
        {value && <Text style={styles.floatingLabel}>Category</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
<Controller
  control={control}
  name="City" // Corrected field name
  rules={{ required: 'City is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
      <Dropdown
   style={styles.dropdown} // Apply consistent styling
   selectedTextStyle={styles.selectedTextStyle}
   inputSearchStyle={styles.inputSearchStyle}
   iconStyle={styles.iconStyle}
   data={cityOptions}
   search
  labelField="label"
  valueField="value"
  placeholder="City"
  searchPlaceholder="City"
  value={value}
  onBlur={onBlur}
  onChange={(item) => {
    onChange(item.value); // This should set the value correctly
    console.log(`Selected City: ${item.label}`); // Log selected city
  }}
/>

        {value && <Text style={styles.floatingLabel}>City</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>

<Controller
  control={control}
  name="ExpenseType" // Corrected field name
  rules={{ required: 'Expense Type is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
      <Dropdown
  style={styles.dropdown} // Apply consistent styling
  selectedTextStyle={styles.selectedTextStyle}
  inputSearchStyle={styles.inputSearchStyle}
  iconStyle={styles.iconStyle}
  data={expenseTypeOptions}
  search
  labelField="label"
  valueField="value"
  placeholder="Expense Type"
  searchPlaceholder="Expense Type"

  value={value}
  onBlur={onBlur}
  onChange={(item) => {
    onChange(item.value); // This should set the value correctly
    console.log(`Selected Expense Type: ${item.label}`); // Log selected type
  }}
/>
        {value && <Text style={styles.floatingLabel}>Expense Type</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>


     {/* Amount Field */}
     <Controller
          control={control}
          name="Amount"
          rules={{ required: 'Amount is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Amount"
                mode="outlined"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.Amount && <HelperText type="error" style={styles.errorText}>{errors.Amount.message}</HelperText>}
            </>
          )}
        />

        {/* Description Field */}
        <Controller
          control={control}
          name="Description"
          rules={{ required: 'Description is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Description"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.Description && <HelperText type="error" style={styles.errorText}>{errors.Description.message}</HelperText>}
            </>
          )}
        />

<Controller
  control={control}
  name="BillSubmitted"
  rules={{ required: 'Bill Submitted status is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={BillSubmittedOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={value ? '' : 'Bill Submitted'} // Correct placeholder
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
          }}
        />
        {value && <Text style={styles.floatingLabel}>Bill Submitted</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
        {/* KM For Petrol Expenses Field */}
        <Controller
          control={control}
          name="KMForPetrolExpenses"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="KM For Petrol Expenses"
                mode="outlined"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
            </>
          )}
        />

        {/* Reference For KM Calculation Field */}
        <Controller
          control={control}
          name="ReferenceForKMCalculation"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Reference for KM Calculation"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
            </>
          )}
        />

        {/* Details or Remarks Field */}
        <Controller
          control={control}
          name="DetailsOrRemarks"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Details / Remarks"
                mode="outlined"
                multiline
                numberOfLines={4}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
            </>
          )}
        />

        {/* Submit Button */}
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
          Submit
        </Button>

        {/* Contact Button */}
        <Button mode="outlined" onPress={handleSubmit(handleAddAnotherExpense)} style={styles.button}>
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
  <FontAwesome
    name="facebook"
    size={24}
    color="Gray"
    style={styles.icon}
  />
  <FontAwesome
    name="twitter"
    size={24}
    color="Gray"
    style={styles.icon}
  />
  <FontAwesome
    name="linkedin"
    size={24}
    color="Black"
    style={styles.icon}
  />
  <FontAwesome
    name="instagram"
    size={24}
    color="Black"
    style={styles.icon}
  />
</View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom:-2,
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  form: {
    marginBottom: 20,
  },
  input:{
    marginBottom: 12,
  },
  input1: {
    marginBottom: 12,
    backgroundColor: 'rgba(200, 160, 190, 0.04)',
 
  },
  dropdownContainer: {
    position: 'relative', // To handle the floating label positioning
    borderColor: '#6200ee',
    color: 'white',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  dropdown: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  floatingLabel: {
    position: 'absolute',
    left: 8,
    top: -10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    fontSize: 14,
    fontWeight:'400',
    color: '#6200ee',
    
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop:-14,
  },
  submitButton: {
    marginTop: 16,
    padding: 10,
  },
  focused: {
    marginTop:10,
    borderColor: '#6200ee', 
  },
  contactContainer: {
    marginTop:3,
    
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
  },
  contactEmail: {
    color: '#6200ee',
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop:6,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10, 
  },
  button: {
    marginVertical: 14,
    
  },
});

export default ExpenseForm;