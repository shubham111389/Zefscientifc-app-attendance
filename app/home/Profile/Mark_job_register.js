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

const ExpenseForm = () => {
  const isOnline = useOnline(); 
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const { dropdownOptions, loading, error } = useDropdownData();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isLoading, setIsLoading] = useState(true);  
  const [isDropdown, setIsDropdown] = useState();  

  const onSubmit = async (data) => {
    const formDatab = new FormData();
    formDatab.append('DateAndDay', data.DateDateAndDay || date.toDateString());
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
    
    /*try {
      const response = await fetch(API_URL_FOR_EXPENSE_POST, {
        method: 'POST',
        body: formDatab,
      });
    
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log(result);
        Alert.alert('Success', 'Form submitted successfully!');
      } else {
        const result = await response.text();
        console.log('Response is not JSON:', result);
        Alert.alert('Success', result);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit the form.');
    }*/
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
 

   /*Transform the data1 to dropdown format
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
  }));*/
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  
  
  

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
        <Title style={styles.title}> 𝙹𝙾𝙱 𝚁𝙴𝙶𝙸𝚂𝚃𝙴𝚁 𝚂𝚄𝙱𝙼𝙸𝚂𝚂𝙸𝙾𝙽</Title>

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
  name="Working Status"
  rules={{ required: 'Working Status is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown} // Apply consistent styling
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={value ? '' : 'Working Status'} // Float placeholder when value exists
          searchPlaceholder="Working Status"
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
            console.log(`Selected Item: ${item.label}`);
          }}
        />
        {/* Floating label effect */}
        {value && <Text style={styles.floatingLabel}>Working Status</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
<Controller
  control={control}
  name="Visit Type" // Corrected field name
  rules={{ required: 'Visit Type is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
      <Dropdown
   style={styles.dropdown} // Apply consistent styling
   selectedTextStyle={styles.selectedTextStyle}
   inputSearchStyle={styles.inputSearchStyle}
   iconStyle={styles.iconStyle}
   data={data}
   search
  labelField="label"
  valueField="value"
  placeholder="Visit Type"
  searchPlaceholder="Visit Type"
  value={value}
  onBlur={onBlur}
  onChange={(item) => {
    onChange(item.value); // This should set the value correctly
    console.log(`Selected City: ${item.label}`); // Log selected city
  }}
/>

        {value && <Text style={styles.floatingLabel}>Visit Type</Text>}
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
  data={data}
  search
  labelField="label"
  valueField="value"
  placeholder="City"
  searchPlaceholder="City"

  value={value}
  onBlur={onBlur}
  onChange={(item) => {
    onChange(item.value); // This should set the value correctly
    console.log(`Selected Expense Type: ${item.label}`); // Log selected type
  }}
/>
        {value && <Text style={styles.floatingLabel}>City </Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
<Controller
  control={control}
  name="Customer " // Corrected field name
  rules={{ required: 'Customer  is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
      <Dropdown
  style={styles.dropdown} // Apply consistent styling
  selectedTextStyle={styles.selectedTextStyle}
  inputSearchStyle={styles.inputSearchStyle}
  iconStyle={styles.iconStyle}
  data={data}
  search
  labelField="label"
  valueField="value"
  placeholder="Customer "
  searchPlaceholder="Customer "

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
          name="Contact Person "
          rules={{ required: 'Contact Person  is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Contact Person "
                mode="outlined"
                keyboardType="textfield"
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
  name="Job Type"
  rules={{ required: 'Job Type is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
  labelField="label"
  valueField="value"
  placeholder="Job Type "
  searchPlaceholder="Job Type "

  value={value}
  onBlur={onBlur}
  onChange={(item) => {
    onChange(item.value); // This should set the value correctly
    console.log(`Selected Expense Type: ${item.label}`); // Log selected type
  }}
  ></Dropdown>
        {value && <Text style={styles.floatingLabel}>Job Type</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
<Controller
  control={control}
  name="Instrument Model"
  rules={{ required: 'Instrument Model is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          labelField="label"
          valueField="value"
          placeholder="Instrument Model "
          searchPlaceholder="Instrument Model "
        
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value); // This should set the value correctly
            console.log(`Selected Expense Type: ${item.label}`); // Log selected type
          }}
        />
        {value && <Text style={styles.floatingLabel}>Instrument Model</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>

<Controller
  control={control}
  name="Accompanied by"
  rules={{ required: 'Accompanied by is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          labelField="label"
          valueField="value"
          placeholder="Accompanied by "
          searchPlaceholder="Accompanied by "
        
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value); // This should set the value correctly
            console.log(`Selected Expense Type: ${item.label}`); // Log selected type
          }}
        />
        {value && <Text style={styles.floatingLabel}>Accompanied by</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>

<Controller
  control={control}
  name="Job Status"
  rules={{ required: 'Job Status is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input1, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          labelField="label"
          valueField="value"
          placeholder="Job Status "
          searchPlaceholder="Job Status "
        
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value); // This should set the value correctly
            console.log(`Selected Expense Type: ${item.label}`); // Log selected type
          }}
        />
        {value && <Text style={styles.floatingLabel}>Job Status</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>

        {/* KM For Petrol Expenses Field */}
        <Controller
          control={control}
          name="Serial No "
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Serial No "
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
    fontSize: 20,
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
    top:-12,
    color: 'red',
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
