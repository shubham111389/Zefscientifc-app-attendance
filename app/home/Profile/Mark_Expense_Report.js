import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Feather, Entypo, AntDesign, Ionicons, Octicons, MaterialIcons, FontAwesome6, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from 'react-hook-form';

const ExpenseForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onSubmit = (data) => {
    data.DateAndDay = date.toDateString(); // Add selected date to form data
    console.log(data);
    // Handle form submission
  };

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
        <Title style={styles.title}>Expense Report Submission</Title>

        {/* Date Navigation with Icons and Date Text */}
        <View style={styles.dateContainer}>
          <AntDesign onPress={goToPrevDay} name="left" size={24} color="#6200ee" />
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <AntDesign onPress={goToNextDay} name="right" size={24} color="#6200ee" />
        </View>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.form}>
        {/* Category Field */}
        <Controller
          control={control}
          name="Category"
          rules={{ required: 'Category is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Expense Category"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.Category && <HelperText type="error" style={styles.errorText}>{errors.Category.message}</HelperText>}
            </>
          )}
        />

        {/* City Field */}
        <Controller
          control={control}
          name="City"
          rules={{ required: 'City is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="City"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.City && <HelperText type="error" style={styles.errorText}>{errors.City.message}</HelperText>}
            </>
          )}
        />

        {/* Expense Type Field */}
        <Controller
          control={control}
          name="ExpenseType"
          rules={{ required: 'Expense Type is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Expense Type"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.ExpenseType && <HelperText type="error" style={styles.errorText}>{errors.ExpenseType.message}</HelperText>}
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

        {/* Bill Submitted Field */}
        <Controller
          control={control}
          name="BillSubmitted"
          rules={{ required: 'Bill Submitted is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Bill Submitted"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }}
              />
              {errors.BillSubmitted && <HelperText type="error" style={styles.errorText}>{errors.BillSubmitted.message}</HelperText>}
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
        <Button mode="outlined" onPress={() => console.log('Add another expense')} style={styles.addButton}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 12,
    color: '#6200ee',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    marginTop: 4,
  },
  button: {
    marginVertical: 16,
  },
  addExpenseText: {
    color: '#6200ee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 12,
    color: '#6200ee',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    marginTop: 4,
  },
  button: {
    marginVertical: 14,
  },
  addExpenseText: {
    color: '#6200ee',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contactContainer: {
    marginTop:6
    ,
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
    marginTop: 4,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10, // Space between icons
  },
});

export default ExpenseForm;