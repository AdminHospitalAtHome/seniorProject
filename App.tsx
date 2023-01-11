import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainContainer from './navigation/MainContainer';
import LoginPage from './navigation/screens/LoginPage'
import InitialSetupScreen from './navigation/screens/InitialSetupScreen'

import {StyleSheet, View, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack'
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
              <Stack.Screen
                name ="LoginPage"
                component={LoginPage}
                options={{headerShown: false}}/>
        <Stack.Screen
                name ="InitialSetupScreen"
                component={InitialSetupScreen} 
                options={{headerShown: false}}/>
        <Stack.Screen
          name="MainContainer"
          component={MainContainer}
          options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
