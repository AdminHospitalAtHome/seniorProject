import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect, Component } from 'react';
import Config from 'react-native-config';
import { ECDH } from 'crypto';
import TextInputMask from 'react-native-text-input-mask';

class UserData {
  first_name:string;
  last_name:string;
  email:string;
  phone:string;
  birth_date:string;
  ec_name:string;
  ec_phone:string;

  constructor(first_name, last_name, email, phone, birth_date
              , ec_name, ec_phone) {
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

  const [data, setData] = useState(new UserData("", "", "", "", "", "", ""));

  const [firstNameState, setFirstNameState] = useState("");
  const [lastNameState, setLastNameState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [birthDateState, setBirthDataState] = useState("");
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [sexState, setSexState] = useState("M");
  const [emergencyNameState, setEmergencyNameState] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");

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
      .then(result => result = JSON.parse(result))
      .then(arr => {
        setData(new UserData(arr.first_name, arr.last_name, arr.id, arr.phone, arr.birth_date, arr.ec_name, arr.ec_phone));
      })
      .catch(error => console.log('error', error));
    }
    fetchPatientData();
  }, []);

  function SubmitUpdates () {
    async function fetchPatientData() {
      console.log("*********************************************");
      console.log("CALLING UpdateUserAccountInfo AZURE FUNCTION");
      console.log("*********************************************");

      const Buffer = require("buffer").Buffer;
      let encodedAuth = new Buffer(id + ":" + password).toString("base64");

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${encodedAuth}`);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      }; 

      var url = `https://hospital-at-home-app.azurewebsites.net/api/UpdateUserAccountInfo?code=${Config.UPDATE_USER_ACCOUNT_INFO_FUNCTION_KEY}` // +
      // `&first=${firstNameState}&last=${lastNameState}&email=${id}&password=${password}&phone=${phoneNumberState}` + 
      // `&dob=${birthDateState}&ecName=${emergencyNameState}&ecPhone=${emergencyPhoneNumber}`;

      if (firstNameState != "") {
        url += `&first=${firstNameState}`;
      } if (lastNameState != "") {
        url += `&last=${lastNameState}`;
      }  if (phoneNumberState != "") {
        url += `&phone=${phoneNumberState.replace(" ", "").replace("(", "").replace(")", "").replace("-", "")}`;
      } if (birthDateState != "") {
        url += `&dob=${birthDateState}`;
      } if (emergencyNameState != "") {
        url += `&ecName=${emergencyNameState}`;
      } if (emergencyPhoneNumber != "") {
        url += `&ecPhone=${emergencyPhoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "")}`;
      }

      console.log(url);
      const created:boolean = await fetch(url, requestOptions)
        .then(response => (response.status == 200 ? true : false))
        .catch(error => false);
      return created;
    }
    fetchPatientData()
  }

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Image
            source={require('./profile.png')} 
            style={styles.profileImage} 
            />
          <View style={styles.nameBox}>
            <TextInput value={firstNameState} onChangeText={text => setFirstNameState(text)} style={styles.inputTextTop} placeholder={data.first_name} placeholderTextColor='#000'/>
            <TextInput value={lastNameState} onChangeText={text => setLastNameState(text)} style={styles.inputTextTop} placeholder={data.last_name} placeholderTextColor='#000'/>
          </View>
        </View>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
            <TextInput value={data.email} onChangeText={text => setEmailState(text)} style={styles.inputText} placeholder={data.email} placeholderTextColor='#000'/>
            <TextInputMask value={phoneNumberState} onChangeText={text => setPhoneNumberState(text)} style={styles.inputText} mask={'([000]) [000]-[0000]'} keyboardType="numeric" placeholder={"(" + data.phone.substring(0, 3) + ") " + data.phone.substring(3, 6) + "-" + data.phone.substring(6, 10)} placeholderTextColor='#000'/>
            <TextInputMask value={birthDateState} onChangeText={text => setBirthDataState(text)} style={styles.inputText} mask={'[00]{/}[00]{/}[0000]'} keyboardType="numeric" placeholder={data.birth_date} placeholderTextColor='#000'/>
            <TextInput value={sexState} style={styles.inputText} placeholder={"M"} placeholderTextColor='#000'/>
          </View>
          <TouchableOpacity
            style={styles.emeregencyButton}
            onPress={() => Alert.alert('Calling Front Desk')}
            underlayColor="#fff">
            <Text style={styles.emeregencyText}>Call Front Desk</Text>
          </TouchableOpacity>
          <View style={styles.emergencyContainer}>
            <TextInput value={emergencyNameState} onChangeText={text => setEmergencyNameState(text)} style={styles.inputText} placeholder={data.ec_name} placeholderTextColor='#000'/>
            <TextInputMask value={emergencyPhoneNumber} onChangeText={text => setEmergencyPhoneNumber(text)} style={styles.inputText} mask={'([000]) [000]-[0000]'} keyboardType="numeric" placeholder={"(" + data.ec_phone.substring(0, 3) + ") " + data.ec_phone.substring(3, 6) + "-" + data.ec_phone.substring(6, 10)} placeholderTextColor='#000'/>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => SubmitUpdates()}
            underlayColor="#fff">
            <Text style={styles.emeregencyText}>Save Changes</Text>
          </TouchableOpacity>
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
  }
});