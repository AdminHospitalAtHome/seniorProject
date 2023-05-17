/*
This file is the main entry point of the application. 
It sets up the main tabbed navigation structure using react-navigation, including the home, messages, and profile screens.
It also sets up the navigation stack using createStackNavigator from '@react-navigation/stack'. 
The App component renders the navigation stack, which contains the main app screens and handles the navigation between them.
*/

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainContainer from './navigation/MainContainer';
import LoginPage from './navigation/screens/LoginPage'
import InitialSetupScreen from './navigation/screens/InitialSetupScreen'

import {StyleSheet, View, Text} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from 'stream-chat-react-native';
const Stack = createStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
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
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}

export default App;
