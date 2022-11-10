/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default function MessagesScreen({navigation}) {
  return (
    <View style={styles.pageContainer}>
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{fontSize: 10}}>
        Click to Go Home
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});