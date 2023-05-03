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
