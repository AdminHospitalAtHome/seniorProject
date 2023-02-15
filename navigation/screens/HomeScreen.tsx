/* eslint-disable prettier/prettier */
import React, { useState, useEffect, Component } from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import {SafeAreaView, StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import { SearchBar } from '@rneui/themed';
import CheckBox from  '@react-native-community/checkbox'
import { DataList, PageHeader, SingleValueChart } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config';
import { Flex, ListItem } from '@react-native-material/core';
import { color } from '@rneui/base';
import Ionicons from 'react-native-vector-icons/Ionicons';

class PatientData {
    first_name:string;
    last_name:string;
    email:string
  
    constructor(first_name:string, last_name:string, email:string) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
    }
  }

export default function HomeScreen({navigation, route}:{navigation:any, route:any}) {
    const [patients, setPatients] = useState<PatientData[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientData>();
    const { id, password } = route.params;
    
    useEffect(() => {
        async function fetchPatientData() {
          const Buffer = require("buffer").Buffer;
          let encodedAuth = new Buffer(id + ":" + password).toString("base64");
          var myHeaders = new Headers();
          myHeaders.append("Authorization", `Basic ${encodedAuth}`);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
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
              fetched.push(new PatientData(patient.first_name, patient.last_name, patient.id))
            }
            console.log(patients)
            setPatients(fetched)
          })
          .catch(error => console.log('error', error));
        }
        fetchPatientData();
      }, []);


    if (!selectedPatient) {
        return (
            <ScrollView style={styles.pageContainer}>
                {/* <SearchBar
                    placeholder="Type Here..."
                    style={styles.searchBar}
                    // onChangeText={this.updateSearch}
                    // value={search}
                    inputStyle={{backgroundColor: 'white'}}
                    containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5}}
                    inputContainerStyle={{backgroundColor: 'white'}}
                />  */}
                {patients.map(patient => {
                    return(
                        <View style={styles.patientsBox}> 
                            {/* <View style={styles.patientsInner} onStartShouldSetResponder={() => navigation.navigate('HomeScreen', {id, password, patientId})}> */}
                            <TouchableOpacity style={styles.patientsInner} onPress={() => setSelectedPatient(patient)}>
                                {/* <Text style={styles.nameText}> {patient.last_name}, {patient.first_name}</Text> */}
                                <Text style={styles.nameText}> {patient.email} </Text>
                                <View style={styles.checkBoxView}> 
                                <Text style={styles.checkBoxText}> Monitoring </Text>
                                <CheckBox style={styles.checkBox}></CheckBox>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })} 
            </ScrollView>
        )
    } else {
        const patientId = selectedPatient.email;
        if (selectedPatient) {
            return (
                <ScrollView style={styles.pageContainer}>
                    <View style={styles.backButton}>
                        <Ionicons name='arrow-back-outline' size={30} color='fff' onPress={() => setSelectedPatient(undefined)}/>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Pulse', {id, password, patientId})}>
                            <Text>Pulse</Text>
                        </View>
                    </View>
        
                    <View style={styles.box}>
                        <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Blood Pressure',  {id, password, patientId})}>
                            <Text>Blood Pressure</Text>
                        </View>
                    </View>
        
                    <View style={styles.box}>
                        <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Weight',  {id, password, patientId})}>
                            <Text
                            >Weight</Text>
                        </View>
                    </View>
        
                    <View style={styles.box}>
                        <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Temperature',  {id, password, patientId})}>
                            <Text>Temperature</Text>
                        </View>
                    </View>
        
                    <View style={styles.box}>
                        <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Oxygen Saturation',  {id, password, patientId})}>
                                <Text>Oxygen Saturation</Text>
                        </View>
                    </View>
        
                    <View style={styles.box}>
                        <View style={styles.inner}>
                            <Text>Whatever</Text>
                        </View>
                    </View>
        
                    <View style={styles.lastBox}>
                        <View style={styles.inner}>
                            <Text>Whatever</Text>
                        </View>
                    </View>
                </ScrollView>
              );
        } else {
            return (
                <ScrollView style={styles.pageContainer}>
                        <View style={styles.box}>
                            <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Pulse', {id, password, patientId})}>
                                <Text>Pulse</Text>
                            </View>
                        </View>
            
                        <View style={styles.box}>
                            <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Blood Pressure',  {id, password, patientId})}>
                                <Text>Blood Pressure</Text>
                            </View>
                        </View>
            
                        <View style={styles.box}>
                            <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Weight',  {id, password, patientId})}>
                                <Text
                               >Weight</Text>
                            </View>
                        </View>
            
                        <View style={styles.box}>
                            <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Temperature',  {id, password, patientId})}>
                                <Text>Temperature</Text>
                            </View>
                        </View>
            
                        <View style={styles.box}>
                            <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Oxygen Saturation',  {id, password, patientId})}>
                                  <Text>Oxygen Saturation</Text>
                            </View>
                        </View>
            
                        <View style={styles.box}>
                            <View style={styles.inner}>
                                <Text>Whatever</Text>
                            </View>
                        </View>
            
                        <View style={styles.lastBox}>
                            <View style={styles.inner}>
                                <Text>Whatever</Text>
                            </View>
                        </View>
                </ScrollView>
              );
        }
    }
}

const styles = StyleSheet.create ({
    pageContainer: {
    alignContent:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
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
    height: '120%',
    width: 350,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  patientsBox: {
    height: '11%',
    padding: 19,
  },
  patientsInner: {
    height: '170%',
    width: 350,
    backgroundColor: '#EEEEEE',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    paddingRight: 340
  }
});
