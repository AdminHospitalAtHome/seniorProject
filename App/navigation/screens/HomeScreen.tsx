/* eslint-disable prettier/prettier */

/*
This file contains the code for the home screen of the application, which is the main screen of the application.  
It displays a list of patients or measurement options depending on whether the user is a patient or a healthcare provider. 
It also handles navigation to other screens based on user interactions.
It displays a list of patients if the current user is a healthcare professional or a list of measurements if the current user is a patient. 
The HomeScreen component handles the navigation between different measurement screens depending on the selection made by the user. 
*/

// Import necessary libraries and components from React, React Native, and external packages
import React, { useState, useEffect} from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Config from 'react-native-config';
import {ListItem, Stack, Surface } from '@react-native-material/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserManager from '../../managers/UserManager';

// Define the PatientPreview class which is used to store patient information (first name, last name, and email)
class PatientPreview {
    first_name:string;
    last_name:string;
    email:string
  
    constructor(first_name:string, last_name:string, email:string) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
    }
  }

// Define the HomeScreen component, which is the main screen users see when they open the app
export default function HomeScreen({navigation}:{navigation:any}) {
  /* 
    Initialize states for patients list, current patient, and refresh trigger    
  */
  const [patients, setPatients] = useState<PatientPreview[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<string>();
  
  useEffect(() => {
    if (UserManager.getInstance().getPatient() != undefined) {
      return;
    }
    async function fetchPatientData() {
      var headers = new Headers();
      headers.append("Authorization", UserManager.getInstance().getEncodedAuthorization());
      var requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow'
      };

      console.log("*********************************************");
      console.log("CALLING GetPatientList AZURE FUNCTION");
      console.log("*********************************************");

      /* ------------------ */

      // Fetch and set the list of patients when the component mounts
      const url = `${Config.GET_PATIENT_LIST_URL}?code=${Config.GET_PATIENT_LIST_FUNCTION_KEY}`;
      fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .then(arr => {
        const fetched = []
        for (var patient of arr) {
          fetched.push(new PatientPreview(patient.first_name, patient.last_name, patient.id));
        }
        setPatients(fetched);
      })
      .catch(error => console.log('error', error));
    }
    fetchPatientData();
  }, []);


  // Define a function to refresh the HomeScreen component when required
  // If the user is not a patient and has not selected a patient to view, display a list of patients to choose from
  if (UserManager.getInstance().getPatient() == undefined) {
      return (
        <ScrollView>
            <Stack fill center spacing={4}>
              {patients.map((patient, index) => {
                return(
                  <Surface
                    key={index}
                    elevation={2}
                    category="medium"
                    style={styles.patientSurface}>
                    {/* <View style={styles.patientsInner} onStartShouldSetResponder={() => navigation.navigate('HomeScreen', {id, password, patientId})}> */}
                    <ListItem
                      key={index}
                      onPress={() => {
                        // When a patient is selected, set the current patient state and refresh the HomeScreen component
                        UserManager.getInstance().setPatient(patient.email);
                        setCurrentPatient(patient.first_name+" "+patient.last_name);
                        setRefresh(!refresh);
                      }}
                      title={`${patient.first_name} ${patient.last_name}`}
                      secondaryText={patient.email}
                    />
                  </Surface>
                );
              })} 
            </Stack>
        </ScrollView>
      )
  } else {
      // If the user is a patient or has selected a patient to view, display a list of available measurements to navigate to
      const backArrow = !UserManager.getInstance().isPatient()
      ? <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name='arrow-back-outline' size={50} color='black' 
            onPress={() => {
              UserManager.getInstance().clearPatient();
              setRefresh(!refresh);
            }}
          />
          <Text style={{ fontSize: 25, marginRight: 15 }}>{currentPatient}</Text>
        </View>
      : <React.Fragment></React.Fragment>
      const measurements = ["Pulse", "Blood Pressure", "Weight", "Temperature", "Oxygen Saturation", "Test", "Test"];
      return (
        // If the user is not a patient, provide a back arrow to deselect the current patient and return to the patients list
        <View style={{justifyContent:'center'}}>
          {backArrow}
          <ScrollView>
            <Stack fill center spacing={4}>
              {measurements.map((measurement, index) => {
                return(
                  <TouchableOpacity
                    // When a measurement is selected, navigate to the corresponding screen
                    onPress={() => {navigation.navigate(measurement);}}
                    key={index}>
                    <Surface
                      key={index}
                      elevation={2}
                      category="medium"
                      style={styles.measurementSelection}
                    >
                      <Text style={{color:'black', textAlign:'center'}}>{measurement}</Text>
                    </Surface>
                  </TouchableOpacity>
                );
              })} 
            </Stack>
          </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create ({
  pageContainer: {
    alignContent:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff'
  },
  box: {
    height: '20%',
    padding: 19,
  },
  lastBox: {
    height: '20%',
    padding: 19,
    marginBottom: 19,
  },
  inner: {
    height: 120,
    width: 370,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  patientSurface: {
    marginVertical: 10,
    height: '7%',
    width: '90%'
  },
  measurementSelection: {
    width:390, 
    height:100,
    justifyContent:'center'
  },
  nameText: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 14,
    color: 'black'
  },
  checkBoxView: {
    alignSelf:'flex-end',
    paddingRight: 10,
    flexDirection: 'row'
  
  },
  checkBoxText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'black',
  },
  checkBox: {
    
  },
  searchBar: {
    backgroundColor: 'white'
    // backg: 'white'
    
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 340,
  }
});
