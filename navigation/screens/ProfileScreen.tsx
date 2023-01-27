/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect, Component } from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
//import { DataList, PageHeader, SingleValueChart } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config';
//import { ListItem } from '@react-native-material/core';

class UserData {
  first_name:string;
  last_name:string;
  email:string;
  phone:string;
  birth_date:string;
  ec_name:string;
  ec_phone:string;

  constructor(first_name:string, last_name:string, email:string, phone:string, birth_date:string
              , ec_name:string, ec_phone:string) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone = phone;
    this.birth_date = birth_date;
    this.ec_name = ec_name;
    this.ec_phone = ec_phone;
  }
}

export default function SettingsScreen({route}:{route:any}) {
  const { id, password } = route.params;

  const [data, setData] = useState<UserData[]>([]);

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
      console.log("CALLING GetPatientProfileData AZURE FUNCTION");
      console.log("*********************************************");

      const url = `https://hospital-at-home-app.azurewebsites.net/api/GetUserData?code=${Config.GET_USER_DATA_FUNCTION_KEY}`;
      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {JSON.parse(result).feed;         
                          console.log(result); //fddfd
        })
        .then(arr => {
          const fetched = [];
          for (var obj of arr) {
            fetched.push(new UserData(obj.first_name, obj.last_name, obj.email, obj.phone, obj.birth_date, obj.ec_phone, obj.ec_name));
          }
          setData(fetched);
          console.log(fetched); // dsdsdsds
        })
        .catch(error => console.log('error', error));
        console.log(data) // oidnoifd
    }
    fetchPatientData();
  }, []);

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Image
            source={require('./profile.png')} 
            style={styles.profileImage} 
            />
          <View style={styles.nameBox}>
            <TextInput value={data.first_name} style={styles.inputTextTop} placeholder='First Name' placeholderTextColor='#000'/>
            <TextInput value={data.last_name} style={styles.inputTextTop} placeholder='Last Name' placeholderTextColor='#000'/>
          </View>
        </View>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
            <TextInput value={data.email} style={styles.inputText} placeholder="Email" placeholderTextColor='#000'/>
            <TextInput value={data.phone} style={styles.inputText} keyboardType="numeric" placeholder="Phone" placeholderTextColor='#000'/>
            <TextInput value={data.birth_date} style={styles.inputText} placeholder="Birthday" placeholderTextColor='#000'/>
            <TextInput value="Not Specified" style={styles.inputText} placeholder="Gender" placeholderTextColor='#000'/>
          </View>
          <TouchableOpacity
              style={styles.emeregencyButton}
              onPress={() => Alert.alert('Calling Front Desk')}
              underlayColor="#fff">
              <Text style={styles.emeregencyText}>Call Front Desk</Text>
            </TouchableOpacity>
          <View style={styles.emergencyContainer}>
            <TextInput value={data.ec_name} style={styles.inputText} placeholder="Emergency Contact Name" placeholderTextColor='#000'/>
            <TextInput value={data.ec_phone} style={styles.inputText} keyboardType="numeric" placeholder="Emergency Contact Phone" placeholderTextColor='#000'/>
          </View>
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
  },
  button: {
    text: "hello"
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
  titleText: { 
    color:'#fff',
  }
});