import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';


const Mark_Expense_Report = () => {
  const route = useRoute();
  const { someParam } = route.params;

  // Use the parameter
  console.log(someParam);
  return (
    <View>
      <Text>Mark_Expense_Report</Text>
    </View>
  )
}

export default Mark_Expense_Report

const styles = StyleSheet.create({})