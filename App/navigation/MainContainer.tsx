import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
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
      <Tab.Screen name={profileName} component={ProfileScreen}/>
    </Tab.Navigator>
  );
}

function MainContainer() {
  return (
  <NavigationContainer independent={true}>
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

export default MainContainer;
