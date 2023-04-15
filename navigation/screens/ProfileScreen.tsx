import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect } from 'react';
import Config from 'react-native-config';
import TextInputMask from 'react-native-text-input-mask';
import UserManager from '../../managers/UserManager';
import { ActivityIndicator } from 'react-native-paper';
import Patient from '../../models/Patient';

export default function SettingsScreen() {
  const [firstNameState, setFirstNameState] = useState("");
  const [lastNameState, setLastNameState] = useState("");
  const [birthDateState, setBirthDateState] = useState("");
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [sexState, setSexState] = useState("");
  const [emergencyNameState, setEmergencyNameState] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");

  const [refresh, setRefresh] = useState(false);

  function submitUpdates () {
    async function fetchPatientData() {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${UserManager.getInstance().getEncodedAuthorization()}`);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      }; 

      var url = `${Config.UPDATE_USER_ACCOUNT_INFO_URL}?code=${Config.UPDATE_USER_ACCOUNT_INFO_FUNCTION_KEY}`;

      if (firstNameState != "") {
        url += `&first=${firstNameState}`;
      } 
      if (lastNameState != "") {
        url += `&last=${lastNameState}`;
      }  
      if (phoneNumberState != "") {
        url += `&phone=${phoneNumberState}`;
      } 
      if (birthDateState != "") {
        url += `&dob=${birthDateState}`;
      } 
      if (emergencyNameState != "") {
        url += `&ecName=${emergencyNameState}`;
      } 
      if (emergencyPhoneNumber != "") {
        url += `&ecPhone=${emergencyPhoneNumber}`;
      }
      if (sexState != "") {
        url += `&sex=${sexState}`;
      }

      console.log("*********************************************");
      console.log("CALLING UpdateUserAccountInfo AZURE FUNCTION");
      console.log("*********************************************");
      const created:boolean = await fetch(url, requestOptions)
        .then(response => (response.status == 200 ? true : false))
        .catch(error => false);
      return created;
    }
    fetchPatientData()
  }

  useEffect(() => {
    if(UserManager.getInstance().getPatient() != undefined) {
      UserManager.getInstance().updatePatientData()
      .then((success:boolean) => {
        if (success) {
          setRefresh(!refresh);
          return;
        }
      });
    }
  }, []);

  if (UserManager.getInstance().getPatient() == undefined ||
      UserManager.getInstance().getPatient()?.getLastName() == "") {
    return(
      <View>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  const patient:Patient = UserManager.getInstance().getPatient()!;
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          {/* <Image
            source={require('./profile.png')} 
            style={styles.profileImage} 
            /> */}
          <View style={styles.nameBox}>
            <TextInput 
              value={firstNameState} 
              onChangeText={text => setFirstNameState(text)} 
              style={styles.inputTextTop} 
              placeholder={patient.getFirstName()} 
              placeholderTextColor='#000'
            />
            <TextInput 
              value={lastNameState} 
              onChangeText={text => setLastNameState(text)} 
              style={styles.inputTextTop} 
              placeholder={patient.getLastName()} 
              placeholderTextColor='#000'
            />
          </View>
        </View>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
            <TextInputMask 
              value={patient.getPhoneNumber()} 
              // onChangeText={(formatted, extracted='') => {
              //   setPhoneNumberState(extracted);
              // }}
              style={styles.inputText} 
              mask={'([000]) [000]-[0000]'} 
              editable={false}
            />
            <TextInputMask 
              value={patient.getBirthDate()} 
              //onChangeText={text => setBirthDateState(text)} 
              style={styles.inputText} 
              mask={'[00]{/}[00]{/}[0000]'} 
              editable={false}
            />
            <TextInput 
              value={sexState} 
              //onChangeText={text => setSexState(text)}
              style={styles.inputText} 
              placeholder={"M"} 
              placeholderTextColor='#000'
            />
          </View>
          {/* <TouchableOpacity
            style={styles.emeregencyButton}
            onPress={() => Alert.alert('Calling Front Desk')}
            underlayColor="#fff">
            <Text style={styles.emeregencyText}>Call Front Desk</Text>
          </TouchableOpacity> */}
          <View style={styles.emergencyContainer}>
            <TextInput 
              value={patient.getEmergencyContactName()} 
              //onChangeText={text => setEmergencyNameState(text)} 
              style={styles.inputText}
            />
            <TextInputMask 
              value={patient.getEmergencyContactPhoneNumber()} 
              // onChangeText={(formatted, extracted='') => {
              //   setEmergencyPhoneNumber(extracted);
              // }}
              style={styles.inputText} 
              mask={'([000]) [000]-[0000]'} 
              // keyboardType="numeric" 
              // placeholder={"(" + data.ec_phone.substring(0, 3) + ") " + data.ec_phone.substring(3, 6) + "-" + data.ec_phone.substring(6, 10)} 
              // placeholderTextColor='#000'
            />
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            //onPress={() => submitUpdates()}
          >
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
  }
});