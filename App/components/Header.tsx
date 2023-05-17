/* eslint-disable prettier/prettier */
{/*
This file contains the code for a reusable header component that can be used throughout the application to maintain a consistent look and feel.
*/}

// Import the required React library
import * as React from 'react';
// Import required components and styles from react-native
import {StyleSheet, View, Text} from 'react-native';

// Define and export the Header component, which is a class-based React component
export default class Header extends React.Component {
  // Define the render method for the Header component, which returns the JSX to be displayed
  return () {
    return (
      // Create a View component with the 'header' style, which sets the appearance of the header
      <View style={styles.header}>
            {/*
            Display a Text component with the content "Header component"
            */}
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
