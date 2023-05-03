/* eslint-disable prettier/prettier */
import React, { useState, useEffect} from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Config from 'react-native-config';
import {ListItem, Stack, Surface } from '@react-native-material/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserManager from '../../managers/UserManager';


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

export default function HomeScreen({navigation}:{navigation:any}) {
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
        <View style={{justifyContent:'center'}}>
          {backArrow}
          <ScrollView>
            <Stack fill center spacing={4}>
              {measurements.map((measurement, index) => {
                return(
                  <TouchableOpacity
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
