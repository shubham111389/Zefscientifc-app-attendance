import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';


const Employee_job_Report = () => {
  const { employee } = useLocalSearchParams();
  console.log(employee);

  return (
    <View>
      <Text>Engineer Name: {employee}</Text>
      <Text>Employee_job_Report</Text>
    </View>
  )
}

export default Employee_job_Report

const styles = StyleSheet.create({})