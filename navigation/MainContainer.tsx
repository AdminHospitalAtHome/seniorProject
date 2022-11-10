import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import InitialSetupScreen from './screens/InitialSetupScreen';
import PulseScreen from './screens/PulseScreen';
import WeightScreen from './screens/WeightScreen';

//Screen names
const homeName = 'Home';
const profileName = 'Profile';
const messagesName = 'Messages';
const initialSetupName = 'Initial Profile Setup';
const pulseName = 'Pulse';
const weightName = 'Weight';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function App() {
  return (
    <Tab.Navigator
      initialRouteName={initialSetupName}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
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
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      screenOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'grey',
        labelStyle: {paddingBottom: 10, fontSize: 10},
        style: {padding: 10, paddingTop: 20, height: 70},
        activeBackgroundColor: '#EEEEEE',
        inactiveBackgroundColor: '#EEEEEE',
      }}>
      <Tab.Screen name={homeName} component={HomeScreen}/>
      <Tab.Screen name={messagesName} component={MessagesScreen} />
      <Tab.Screen name={profileName} component={ProfileScreen} />
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
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default MainContainer;
