/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default class Header extends React.Component {
  return () {
    return (
      <View style={styles.header}>
            <Text>Header component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 15%,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  }
});
