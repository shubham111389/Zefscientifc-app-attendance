import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import {API_URL} from "@env"

import Constants from 'expo-constants';
const FetchJobData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(API_URL);
        const data1= await fetch( API_URL);
        const result = await data1.json();
        console.log(result.data);
        
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Data</Text>
      
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Name: {item.Name}</Text>
            <Text style={styles.text}>City: {item.Address}</Text>
            <Text style={styles.text}>State: {item.Phone}</Text>
          </View>
        )}

      />
        {console.log(data)}

    </View>
  );
};

export default FetchJobData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
});
