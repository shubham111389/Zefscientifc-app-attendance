import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AntDesign } from "@expo/vector-icons";
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';

const ExpenseForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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

  const onSubmit = (data) => {
    data.DateAndDay = date.toDateString(); 
    console.log(data);
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
          name="Expense Type"
          rules={{ required: 'Expense Type is required' }}
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <>
             <Controller
  control={control}
  name="Expense Type"
  rules={{ required: 'Expense Type is required' }}
  render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
    <>
      <View style={[styles.input, styles.dropdownContainer, value ? styles.focused : {}]}>
        <Dropdown
          style={styles.dropdown} // Apply consistent styling
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={value ? '' : 'Expense Type'} // Float placeholder when value exists
          searchPlaceholder="Search..."
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
            console.log(`Selected Item: ${item.label}`);
          }}
        />
        {/* Floating label effect */}
        {value && <Text style={styles.floatingLabel}>Expense Type</Text>}
      </View>
      {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
    </>
  )}
/>
              {error && <HelperText type="error" style={styles.errorText}>{error.message}</HelperText>}
            </>
          )}
        />

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

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        >
          Submit
        </Button>
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
    marginVertical: 10,
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  dropdownContainer: {
    position: 'relative', // To handle the floating label positioning
    borderColor: '#6200ee',
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
  },
  submitButton: {
    marginTop: 16,
    padding: 10,
  },
  focused: {
    borderColor: '#6200ee', // Outline color when focused
  },
});

export default ExpenseForm;
