import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator,Text, Alert } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useForm, Controller } from 'react-hook-form';
import { API_URL_FOR_EXPENSE_POST } from "@env"
import { Dropdown } from 'react-native-element-dropdown';
import useDropdownData from '../../../Hooks/useDropdownData';
import LoadingScreen from './LoadingScreen';
import useOnline from '../../../Hooks/useOnline';
import { useRouter } from 'expo-router';
import CustomAlert from './CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineComponent from './OfflineComponent';

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
  const [alertConfig, setAlertConfig] = useState({
    visible: false,  
    type: 'success',
    title: '',
    message: ''
  });

  const [EmployeeName, setEmployeeName] = useState("name");
  const [Employee_Code, setEmployee_Code] = useState('00'); 
  const [Expense_Type, setExpense_Type] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingAnother, setIsAddingAnother] = useState(false);
  const [isAddingAnotherview, setIsAddingAnotherview] = useState(true);


  const getUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('@user_data');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.log('Error fetching user data from AsyncStorage:', error);
    }
  };
  
  useEffect(() => {
    getUserData();
  }, []);
  
  useEffect(() => {
    if (userData) {
      setEmployee_Code(userData.Employee_Code)
      setEmployeeName(`${userData.firstName} ${userData.lastName}`);
    }
  }, [userData]);

  const onSubmit = async (data) => {

    setIsSubmitting(true);

    const getValueOrNA = (value) => {
      if (value === undefined || value === null || value === '') {
        return 'N/A';
      }
      return value;
    };
  


    const formDatab = new FormData();
    formDatab.append('DateAndDay', data.DateDateAndDay || date.toDateString());
    formDatab.append('EmployeeName', EmployeeName);
    formDatab.append('Category', getValueOrNA(data.Category));
    formDatab.append('City', getValueOrNA(data.City));
    formDatab.append('ExpenseType', getValueOrNA(data.ExpenseType));
    formDatab.append('Amount', getValueOrNA(data.Amount));
    formDatab.append('Description', getValueOrNA(data.Description));
    formDatab.append('BillSubmitted', getValueOrNA(data.BillSubmitted));
    formDatab.append('KMForPetrolExpenses', getValueOrNA(data.KMForPetrolExpenses));
    formDatab.append('ReferenceForKMCalculation',getValueOrNA(data.ReferenceForKMCalculation));
    formDatab.append('DetailsOrRemarks', getValueOrNA(data.DetailsOrRemarks));
    formDatab.append('Employee_Code', getValueOrNA(Employee_Code));

    try {
      const response = await fetch(API_URL_FOR_EXPENSE_POST, {
        method: 'POST',
        body: formDatab,
      });
      console.log( response);
      if (response.ok) {

        setIsSubmitting( false);

        setAlertConfig({
          visible: true,
          type: 'success',
          title: 'Success! 🎉',
          message: 'Your expense report has been submitted successfully.'
        });
      } else {
        setAlertConfig({
          visible: true,
          type: 'error',
          title: 'Submission Failed',
          message: 'There was an error submitting your expense report. Please try again.'
        });
      }
      console.log( response);
    } catch (error) {
      console.error('Error:', error);
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to the server. Please check your internet connection.'
      });
     
    }
  };

  const handleAddAnotherExpense = async (data) => {

    setIsAddingAnother(true);
    setIsAddingAnotherview(false);
    
    try {
      await onSubmit(data);
     
      router.push('./Mark_job_register');
    } finally {
      setIsAddingAnother(false);
    }
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
          name="Category"
          rules={{ required: 'Category is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
              <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                <Dropdown
                  style={styles.dropdown}
                  selectedTextStyle={styles.inputText}
                  inputSearchStyle={styles.searchInput}
                  iconStyle={styles.iconStyle}
                  data={categoryOptions}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={value ? '' : 'Category'}
                  searchPlaceholder="Category"
                  value={value}
                  onBlur={onBlur}
                  onChange={(item) => onChange(item.value)}
                  placeholderStyle={styles.placeholderText}
                />
                {value && <Text style={styles.floatingLabel}>Category</Text>}
              </View>
              {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
            </>
          )}
        />

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
                  placeholder={value ? '' : 'City'}
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

        <Controller
          control={control}
          name="ExpenseType"
          rules={{ required: 'Expense Type is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
              <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                <Dropdown
                  style={styles.dropdown}
                  selectedTextStyle={styles.inputText}
                  inputSearchStyle={styles.searchInput}
                  iconStyle={styles.iconStyle}
                  data={expenseTypeOptions}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder={value ? '' : 'Expense Type'}
                  searchPlaceholder="Expense Type"
                  value={value}
                  onBlur={onBlur}
                  onChange={(item) => {
                    onChange(item.value);
                    setExpense_Type(item.value);
                    // Auto-set amount based on expense type
              }}
                  placeholderStyle={styles.placeholderText}
                />
                {value && <Text style={styles.floatingLabel}>Expense Type</Text>}
              </View>
              {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
            </>
          )}
        />
     
     <Controller
  control={control}
  name="Amount"
  rules={{ required: 'Amount is required' }}
  defaultValue=""
  render={({ field: { onChange, onBlur, value } }) => {
    // Set automatic values based on expense type
    useEffect(() => {
      if (Expense_Type === 'DA Local') {
        onChange('150');
      } else if (Expense_Type === 'DA Outstation') {
        onChange('600');
      }
    }, [Expense_Type]);

    return (
      <>
        <TextInput
          label="Amount"
          mode="outlined"
          keyboardType="numeric"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          style={styles.input}
          theme={styles.textInputTheme}
          editable={!(Expense_Type === 'DA Local' || Expense_Type === 'DA Outstation')}
        />
        {errors.Amount && (
          <HelperText type="error" style={styles.errorText}>
            {errors.Amount.message}
          </HelperText>
        )}
      </>
    );
  }}
/>

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
                theme={styles.textInputTheme}
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
              <View style={[styles.inputContainer, value ? styles.focusedInput : {}]}>
                <Dropdown
                  style={styles.dropdown}
                  selectedTextStyle={styles.inputText}
                  inputSearchStyle={styles.searchInput}
                  iconStyle={styles.iconStyle}
                  data={BillSubmittedOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={value ? '' : 'Bill Submitted'}
                  value={value}
                  onBlur={onBlur}
                  onChange={(item) => onChange(item.value)}
                  placeholderStyle={styles.placeholderText}
                />
                {value && <Text style={styles.floatingLabel}>Bill Submitted</Text>}
              </View>
              {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
            </>
          )}
        />
       {Expense_Type=== 'Petrol' && (
        <Controller
          control={control}
          name="KMForPetrolExpenses"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="KM For Petrol Expenses"
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
       )}

        {Expense_Type=== 'Petrol' && (
        <Controller
          control={control}
          name="ReferenceForKMCalculation"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Reference for KM Calculation"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              theme={styles.textInputTheme}
            />
          )}
        />

        )}

        <Controller
          control={control}
          name="DetailsOrRemarks"
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

<View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          style={[styles.button, isSubmitting && styles.buttonLoading]}
          buttonColor="#3498DB"
         
        >
          {isSubmitting ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#3498DB" size={20} style={styles.spinner} />
              <Text style={styles.buttonText}>Submitting...</Text>
            </View>
          ) : (
            "Submit"
          )}
        </Button>
        

        {isAddingAnotherview?
        <Button 
          mode="outlined" 
          onPress={handleSubmit(handleAddAnotherExpense)
           
          } 
          style={[styles.button, isAddingAnother && styles.buttonLoading]}
          textColor="#3498DB"
          disabled={ isAddingAnother}
        >
          {isAddingAnother ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color= "#3498DB" size={20} style={styles.spinner} />
              <Text style={[styles.buttonText, { color: '#3498DB' }]}>Processing...</Text>
            </View>
          ) : (
            "Add Another Expense Register"
          )}
        </Button>
        : <View>
          </View>
          
          }

      </View>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          If you have any issues or need further assistance, please contact us at
          <Text style={styles.contactEmail}> a.shubham@zefsci.com</Text>
        </Text>
      </View>

      <View style={styles.socialIconsContainer}>
         <FontAwesome name="facebook" size={24} color="#3498DB" style={styles.icon} />
                <FontAwesome name="twitter" size={24} color="#1DA1F2" style={styles.icon} />
                <FontAwesome name="linkedin" size={24} color="#0077B5" style={styles.icon} />
                <FontAwesome name="instagram" size={24} color="#E1306C" style={styles.icon} />
       </View>

       <CustomAlert
        visible={alertConfig.visible}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
      />
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
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    height: 48,
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  spinner: {
    marginRight: 8,
  },
  textInputTheme: {
    colors: {
      primary: '#3498DB',      // Primary color for focus state
      text: '#ECF0F1',         // Text color
      placeholder: '#7F8C8D',   // Placeholder text color
      background: '#172435',    // Background color
      surface: '#172435',       // Surface color
      outlineVariant: '#3498DB', // Border color
      onSurface: '#ECF0F1',    // This is crucial for text color
      onBackground: '#ECF0F1', // Additional text color property
    },
  },
});

export default ExpenseForm;