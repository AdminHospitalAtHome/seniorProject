/*
This file contains the code for the profile screen, which displays user or patient information (e.g., name, phone number, etc.) 
and emergency contact information if available. 
For non-patient users, it also shows the personal information of the currently selected patient.
*/


// Import necessary modules and components from React, React Native, and external libraries.
// These imports include styles, TextInputMask for formatted input fields, Config for environment variables,
// UserManager for controlling user-related data, and Patient model for handling patient data.
import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect } from 'react';
import Config from 'react-native-config';
import TextInputMask from 'react-native-text-input-mask';
import UserManager from '../../managers/UserManager';
import { ActivityIndicator } from 'react-native-paper';
import Patient from '../../models/Patient';

export default function SettingsScreen() {
  // Define local state variables for holding user's profile information.
  // These variables include first name, last name, birth date, phone number, sex, emergency contact name and phone number.
  // useState hooks are used to manage these state variables, providing default values and state update functions.
  const [firstNameState, setFirstNameState] = useState("");
  const [lastNameState, setLastNameState] = useState("");
  const [birthDateState, setBirthDateState] = useState("");
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [sexState, setSexState] = useState("");
  const [emergencyNameState, setEmergencyNameState] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");

  const [refresh, setRefresh] = useState(false);

  // function submitUpdates () {
  //   async function fetchPatientData() {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Authorization", `Basic ${UserManager.getInstance().getEncodedAuthorization()}`);

  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       redirect: 'follow'
  //     }; 

  //     var url = `${Config.UPDATE_USER_ACCOUNT_INFO_URL}?code=${Config.UPDATE_USER_ACCOUNT_INFO_FUNCTION_KEY}`;

  //     if (firstNameState != "") {
  //       url += `&first=${firstNameState}`;
  //     } 
  //     if (lastNameState != "") {
  //       url += `&last=${lastNameState}`;
  //     }  
  //     if (phoneNumberState != "") {
  //       url += `&phone=${phoneNumberState}`;
  //     } 
  //     if (birthDateState != "") {
  //       url += `&dob=${birthDateState}`;
  //     } 
  //     if (emergencyNameState != "") {
  //       url += `&ecName=${emergencyNameState}`;
  //     } 
  //     if (emergencyPhoneNumber != "") {
  //       url += `&ecPhone=${emergencyPhoneNumber}`;
  //     }
  //     if (sexState != "") {
  //       url += `&sex=${sexState}`;
  //     }

  //     console.log("*********************************************");
  //     console.log("CALLING UpdateUserAccountInfo AZURE FUNCTION");
  //     console.log("*********************************************");
  //     const created:boolean = await fetch(url, requestOptions)
  //       .then(response => (response.status == 200 ? true : false))
  //       .catch(error => false);
  //     return created;
  //   }
  //   fetchPatientData()
  // }

  // Define a function called reloadDisplayData for fetching user's profile data and updating the local state variables.
  // This function is used to keep the displayed data up-to-date whenever the user visits the Profile screen.
  function reloadDisplayData() {
    if (UserManager.getInstance().getPatient() != undefined) {
      UserManager.getInstance().updatePatientData()
        .then((success: boolean) => {
          if (success) {
            setRefresh(!refresh);
            return;
          }
        });
    }
  }

  // useEffect hook is used to call the reloadDisplayData function when the component mounts.
  // This ensures that the user's profile data is fetched and displayed as soon as the Profile screen is loaded.
  useEffect(() => {
    reloadDisplayData();
  }, []);

  let displayFirstName:string;
  let displayLastName:string;
  let displayPhoneNumber:string;
  if (UserManager.getInstance().getPatient() == undefined) {
    if (UserManager.getInstance().isPatient()) {
      return(
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    } else {
      reloadDisplayData();
      displayFirstName = UserManager.getInstance().getFirstName();
      displayLastName = UserManager.getInstance().getLastName();
      displayPhoneNumber = UserManager.getInstance().getPhoneNumber();
    }
  } else {
      displayFirstName = UserManager.getInstance().getPatient()!.getFirstName();
      displayLastName = UserManager.getInstance().getPatient()!.getLastName();
      displayPhoneNumber = UserManager.getInstance().getPatient()!.getPhoneNumber();
  }
  //UserManager.getInstance().getPatient()?.getLastName() == ""
  const patient:Patient = UserManager.getInstance().getPatient()!;
  

  // The main functional component for the Profile screen.
  // The component uses a ScrollView to display the user's profile information in a scrollable view, making it suitable for different screen sizes.
  // The component conditionally renders different elements based on the user's role (patient or non-patient) and the availability of patient data.
  // If the user has a patient profile, the user's data is displayed along with emergency contact information.
  // In case the user is not a patient, the component renders a list of patients for the user to select and view their profile information.
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../resources/profile_placeholder.jpg')} 
            style={styles.profileImage} 
          />
          <View style={styles.nameBox}>
            <TextInput
              style={styles.inputTextTop} 
              placeholder={displayFirstName} 
              placeholderTextColor='#000'
              editable={false}
            />
            <TextInput
              style={styles.inputTextTop} 
              placeholder={displayLastName} 
              placeholderTextColor='#000'
              editable={false}
            />
          </View>
        </View>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
            <TextInputMask 
              value={displayPhoneNumber} 
              style={styles.inputText} 
              mask={'([000]) [000]-[0000]'} 
              editable={false}
            />
            {/*
            If the user has a patient profile, display the user's profile information including name, birth date, and phone number.
            Also, display the emergency contact information if available.
            The TextInput and TextInputMask components are used to display the data in a formatted and readable manner.
            These input fields are set to non-editable mode, meaning the user cannot directly change the data on this screen.
            */}
            {(UserManager.getInstance().getPatient() != undefined) ?
              <TextInputMask 
              value={patient.getBirthDate()} 
              style={styles.inputText} 
              mask={'[00]{/}[00]{/}[0000]'} 
              editable={false}
            /> : <></>}
            {/* <TextInput 
              value={sexState}
              style={styles.inputText} 
              placeholder={"M"} 
              placeholderTextColor='#000'
            /> */}
          </View>
          {/*
          If the user is not a patient, render a list of patients for the user to select and view their profile information.
          The list of patients is fetched from the UserManager and displayed using a Stack and Surface components from the react-native-material library.
          Each patient is displayed as a ListItem component, allowing the user to tap on a patient's name to view their profile information.
          When a patient is selected, the UserManager's setPatient method is called, and the Profile screen is re-rendered to display the selected patient's information.
          */}
         {(UserManager.getInstance().getPatient() != undefined) ?
            <View style={styles.emergencyContainer}>
              <Text style={styles.ecInfoHeader}>Emergency Contact Information</Text>
              <TextInput
                value={patient.getEmergencyContactName()}
                style={styles.inputText}
                editable={false} />
              <TextInputMask
                value={patient.getEmergencyContactPhoneNumber()}
                style={styles.inputText}
                mask={'([000]) [000]-[0000]'}
                editable={false} />
            </View>
              : <></>}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  topContainer: {
    height: '50%',
    flex: 1,
    // backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  lowContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  nameBox: {
    height: '70%',
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage:{
    height: 120,
    width: 120,
    marginRight: 10,
  },
  infoContainer: {
    height: '50%',
    marginBottom: 10,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  emergencyContainer: {
    height: '50%',
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#EEEEEE',
    paddingBottom: 10,
  },
  inputTextTop: {
    borderwidth: 5,
    borderColor: 'black',
    padding: 5,
    margin: 10,
    width: 200,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1.3,
  },
  inputText: {
    borderwidth: 5,
    borderColor: 'black',
    padding: 5,
    margin: 10,
    borderBottomColor: '#673AB7',
    borderBottomWidth: 1.3,
    color: 'black'
  },
  emeregencyButton:{
    marginRight: 60,
    marginLeft:60,
    marginTop: 10,
    marginBottom: 20,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#D72C06',
    borderRadius:0,
    borderWidth: 0,
    borderColor: '#D72C06'
  },
  emeregencyText:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 20,
    paddingRight : 20,
  },
  saveButton:{
    marginRight: 95,
    marginLeft:95,
    marginTop: 10,
    marginBottom: 20,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#673AB7',
    borderRadius:0,
    borderWidth: 0,
    borderColor: '#673AB7'
  },
  titleText: { 
    color:'#fff',
  },
  ecInfoHeader: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10
  }
});
