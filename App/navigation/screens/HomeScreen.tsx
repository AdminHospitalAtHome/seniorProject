/* eslint-disable prettier/prettier */
import React, { useState, useEffect, Component } from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import {SafeAreaView, StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import CheckBox from  '@react-native-community/checkbox'
import { DataList, PageHeader, SingleValueChart } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config';
import { Flex, ListItem, Stack, Surface } from '@react-native-material/core';
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
            {/* <SearchBar
                placeholder="Type Here..."
                style={styles.searchBar}
                // onChangeText={this.updateSearch}
                // value={search}
                inputStyle={{backgroundColor: 'white'}}
                containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
                inputContainerStyle={{backgroundColor: 'white'}}
            />  */}
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
      ? <View style={styles.backButton}>
          <Ionicons name='arrow-back-outline' size={50} color='black' 
            onPress={() => {
              UserManager.getInstance().clearPatient();
              setRefresh(!refresh);
            }}
          />
        </View>
      : <React.Fragment></React.Fragment>
      return (
        <View style={{justifyContent:'center'}}>
          {backArrow}
          <ScrollView style={styles.pageContainer}>
              <View style={styles.box}>
                  <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Pulse')}>
                      <Text style={{color:'black'}}>Pulse</Text>
                  </View>
              </View>
  
              <View style={styles.box}>
                  <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Blood Pressure')}>
                      <Text style={{color:'black'}}>Blood Pressure</Text>
                  </View>
              </View>
  
              <View style={styles.box}>
                  <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Weight')}>
                      <Text style={{color:'black'}}>Weight</Text>
                  </View>
              </View>
  
              <View style={styles.box}>
                  <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Temperature')}>
                      <Text style={{color:'black'}}>Temperature</Text>
                  </View>
              </View>
  
              <View style={styles.box}>
                  <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Oxygen Saturation')}>
                      <Text style={{color:'black'}}>Oxygen Saturation</Text>
                  </View>
              </View>
  
              <View style={styles.box}>
                  <View style={styles.inner}>
                      <Text style={{color:'black'}}>Whatever</Text>
                  </View>
              </View>
  
              <View style={styles.lastBox}>
                  <View style={styles.inner}>
                      <Text style={{color:'black'}}>Whatever</Text>
                  </View>
              </View>
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
