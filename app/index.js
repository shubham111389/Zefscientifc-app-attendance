import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import * as SystemUI from 'expo-system-ui';


const index = () => {
  return (
   <Redirect href="/home/Profile/Home"/>
  )
}


export default index

const styles = StyleSheet.create({})

// "/"