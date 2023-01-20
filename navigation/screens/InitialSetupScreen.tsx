/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Button} from '@react-native-material/core';
import {TextInput} from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import Config from 'react-native-config';

export default function InitialSetupScreen({navigation}: {navigation: any}) {
  const [fName, setFName] = useState('');
  const [fNameError, setFNameError] = useState(false);
  const [lName, setLName] = useState('');
  const [lNameError, setLNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dob, setDOB] = useState('');
  const [dobError, setDOBError] = useState('');
  const [ecName, setECName] = useState('');
  const [ecPhone, setECPhone] = useState('');

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Set Up Your Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.scrollView}>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="First Name"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={fName}
            onChangeText={fName => setFName(fName.trim())}
            error={fNameError}
          />
        </View>
        <View style={styles.scrollView}>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="Last Name"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={lName}
            onChangeText={lName => setLName(lName.trim())}
            error={lNameError}
          />
        </View>
        <View style={styles.scrollView}>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="Email"
            autoCapitalize="none"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={email}
            onChangeText={email => setEmail(email.trim())}
            error={emailError}
          />
        </View>
        <View style={styles.scrollView}>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            style={styles.textEntry}
            label="Password"
            autoCapitalize="none"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={password}
            onChangeText={password => setPassword(password.trim())}
            error={passwordError}
          />
        </View>
        <View style={styles.scrollView}>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            style={styles.textEntry}
            label="Confirm Password"
            autoCapitalize="none"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={confirmPassword}
            onChangeText={confirmPassword => setConfirmPassword(confirmPassword.trim())}
            error={confirmPasswordError}
          />
        </View>
        <View style={styles.midContainer}>
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black', marginBottom: 0}}>
              Phone:{' '}
            </Text>
            <TextInputMask
              style={styles.maskedEntry}
              onChangeText={(formatted, extracted='') => {
                setPhone(extracted);
              }}
              mask={'+1 ([000]) [000]-[0000]'}
              placeholder={'(000) 000-0000'}
              keyboardType="numeric"
              placeholderTextColor="grey"
            />
            {!!phoneError && (
              <Text style={styles.error}>&nbsp;&nbsp;{phoneError}</Text>
            )}
          </View>
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black'}}>Date of Birth: </Text>
            <TextInputMask
              style={styles.maskedEntry}
              onChangeText={formatted=> {
                setDOB(formatted);
              }}
              mask={'[00]{/}[00]{/}[0000]'}
              placeholder={'MM/DD/YYYY'}
              keyboardType="numeric"
              placeholderTextColor="grey"
            />
            {!!dobError && (
              <Text style={styles.error}>&nbsp;&nbsp;{dobError}</Text>
            )}
          </View>
        </View>

        <View style={styles.botContainer}>
          <Text style={styles.sectionHeader}>
            Emergency Contact Information
          </Text>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="Emergency Contact Name"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={ecName}
            onChangeText={ecName => setECName(ecName.trim())}
          />
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black'}}>E.C. Phone: </Text>
            <TextInputMask
              style={styles.maskedEntry}
              mask={'+1 ([000]) [000]-[0000]'}
              placeholder={'(000) 000-0000'}
              keyboardType="numeric"
              placeholderTextColor="grey"
              value={ecPhone}
              onChangeText={(formatted, extracted='') => {
                setECPhone(extracted);
              }}
            />
          </View>
        </View>
        <View style={styles.submissionContainer}>
          <Button
            style={styles.submissionButton}
            title="Submit"
            color="#D72C06"
            onPress={async () => {
              let notReady:boolean = false;
              if (!fName) {
                setFNameError(true);
                notReady = true;
              } else {
                setFNameError(false);
              }
              if (!lName) {
                setLNameError(true);
                notReady = true;
              } else {
                setLNameError(false);
              }
              if (!email) {
                setEmailError(true);
                notReady = true;
              } else {
                setEmailError(false);
              }
              if (!password) {
                setPasswordError(true);
                notReady = true;
              } else {
                setPasswordError(false);
              }
              if (confirmPassword != password) {
                setConfirmPasswordError(true);
                notReady = true;
              } else {
                setConfirmPasswordError(false);
              }
              if (!phone) {
                notReady = true;
                setPhoneError('*');
              } else if (phone.length != 10) {
                notReady = true;
                setPhoneError('X');
              } else {
                setPhoneError('');
              }
              if (!dob) {
                notReady = true;
                setDOBError('*');
              } else if (dob.length != 10) {
                notReady = true;
                setDOBError('X');
              } else {
                setDOBError('');
              }
              if (notReady) {
                return;
              }
              const worked:boolean = await createAccount(fName, lName, email, password, phone, dob, ecName, ecPhone);
              if (worked) {
                navigation.navigate('MainContainer', {
                  id:email, 
                  password:password
                });
              } else {
                console.log("Something went wrong with account creation.")
                //TODO: Alert user to error
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

async function createAccount(
  first:string,
  last:string,
  email:string,
  password:string,
  phone:string,
  dob:string,
  ecName:string,
  ecPhone:string
):Promise<boolean> {
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };
  console.log("*********************************************");
  console.log("CALLING CreateUserAccount AZURE FUNCTION");
  console.log("*********************************************");

  /* ------------------ */
  const url = `${Config.CREATE_USER_ACCOUNT_URL}?code=${Config.CREATE_USER_ACCOUNT_FUNCTION_KEY}` +
                `&first=${first}&last=${last}&email=${email}&password=${password}&phone=${phone}` + 
                `&dob=${dob}&ecName=${ecName}&ecPhone=${ecPhone}`;
  console.log(url);
  const created:boolean = await fetch(url, requestOptions)
    .then(response => (response.status == 200 ? true : false))
    .catch(error => false);
  return created;
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  error: {
    fontSize: 20,
    color: 'red',
  },
  scrollView: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  scrollContainer: {
    flex: 1,
  },
  midContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  botContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  pageTitleContainer: {
    width: '100%',
    backgroundColor: '#D72C06',
  },
  pageTitle: {
    textAlign: 'center',
    font: 'signika',
    color: 'white',
    marginVertical: '5%',
    fontSize: 30,
    fontWeight: 'bold',
  },
  sectionHeader: {
    font: 'signika',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textEntry: {
    height: Dimensions.get('window').height * 0.07,
    width: Dimensions.get('window').width * 0.8,
    marginVertical: '3%',
  },
  maskedInputContainer: {
    width: Dimensions.get('window').width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '3%',
  },
  maskedEntry: {
    font: 'signika',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'grey',
    textAlign: 'center',
  },
  submissionContainer: {
    width: Dimensions.get('window').width * 0.8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  submissionButton: {
    width: Dimensions.get('window').width * 0.3,
  },
});
