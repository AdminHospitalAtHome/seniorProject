/*
This file sets up the main navigation structure for the application, 
which includes a stack navigator containing several measurement-related screens (e.g., PulseScreen, WeightScreen, BloodPressureScreen, etc.).
It also defines the MainContainer function that wraps the navigation setup in a NavigationContainer component.
This file defines the MainContainer component, which is responsible for setting up the main navigation structure of the application using createBottomTabNavigator from '@react-navigation/bottom-tabs'. 
The MainContainer component renders the tab navigator with the defined screens and handles the navigation between them.
*/

// 'react' is necessary for creating React components.
import * as React from 'react';
// '@react-navigation/native' and '@react-navigation/bottom-tabs' are used for navigating between screens.
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// 'react-native-vector-icons/Ionicons' is a library for using icons in the app.
import Ionicons from 'react-native-vector-icons/Ionicons';
// '@react-navigation/stack' is used for creating a stack of screens to navigate through.
import { createStackNavigator } from '@react-navigation/stack';

// Screens
// Import the screens used in the navigation for the MainContainer component.
// These screens are sub-views that will be displayed when navigating between different app sections.
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/StreamChatScreen';
import PulseScreen from './screens/PulseScreen';
import WeightScreen from './screens/WeightScreen';
import BloodPressureScreen from './screens/BloodPressureScreen';
import TemperatureScreen from './screens/TemperatureScreen';
import OxygenSaturationScreen from './screens/OxygenSaturationScreen'

// Screen names
const homeName = 'Home';
const profileName = 'Profile';
const messagesName = 'Messages';
const chatName = 'Chat';
const initialSetupName = 'Initial Profile Setup';
const pulseName = 'Pulse';
const weightName = 'Weight';
const bloodPressureName = 'Blood Pressure';
const temperatureName = 'Temperature';
const oxygenSaturationName = 'Oxygen Saturation';

const Tab = createBottomTabNavigator();
// Create a Stack Navigator.
const Stack = createStackNavigator();

function App({route}:{route:any}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        activeTintColor: 'black',
        inactiveTintColor: 'grey',
        labelStyle: {paddingBottom: 10, fontSize: 10},
        style: {padding: 10, paddingTop: 20, height: 70},
        activeBackgroundColor: '#EEEEEE',
        inactiveBackgroundColor: '#EEEEEE',
        tabBarIcon: ({focused, color, size}) => {
          let iconName:string = "home";
          switch (route.name) {
            case homeName:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case profileName:
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case messagesName:
              iconName = focused ? 'mail' : 'mail-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name={homeName} component={HomeScreen}/>
      <Tab.Screen name={messagesName} component={MessagesScreen}/>
      <Tab.Screen name={profileName} component={ProfileScreen} options={{unmountOnBlur: true}}/>
    </Tab.Navigator>
  );
}

// Define the MainContainer component, which initializes the main Stack Navigator and sets up the routes for each screen.
// This component will be the main wrapper for the application's screens and navigation.
function MainContainer() {
  return (
  <NavigationContainer independent={true}>
    {/*
    Create a Stack.Navigator component to handle the navigation between screens.
    Each Stack.Screen component inside the Stack.Navigator represents a single screen in the app.

    The "name" attribute is a unique identifier for the screen, and the "component" attribute specifies the React component that corresponds to that screen.

    The "options" attribute can be used to customize the appearance and behavior of the screen.
    In this case, the "headerShown" option is set to false for the Main screen to hide the header.
    */}
    <Stack.Navigator>
     <Stack.Screen name="Main" component={App} options={{ headerShown: false }}/>
     <Stack.Screen name={pulseName} component={PulseScreen}/>
     <Stack.Screen name={weightName} component={WeightScreen}/>
     <Stack.Screen name={bloodPressureName} component={BloodPressureScreen}/>
     <Stack.Screen name={temperatureName} component={TemperatureScreen}/>
     <Stack.Screen name={oxygenSaturationName} component={OxygenSaturationScreen}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

// Export the MainContainer component so it can be used in other parts of the app.
export default MainContainer;
