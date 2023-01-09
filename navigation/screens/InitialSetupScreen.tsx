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

export default function InitialSetupScreen({navigation}: {navigation: any}) {
  const [FNText, setFNText] = useState('');
  const [FNError, setFNError] = useState('');
  const [LNText, setLNText] = useState('');
  const [LNError, setLNError] = useState('');
  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState('');
  const [Phone, setPhone] = useState('');
  const [PhoneError, setPhoneError] = useState('');
  const [DOB, setDOB] = useState('');
  const [DOBError, setDOBError] = useState('');
  const [EMCName, setEMCName] = useState('');
  const [EMCPhone, setEMCPhone] = useState('');
  var phoneValid = false;
  var DOBValid = false;

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
            value={FNText}
            onChangeText={FNText => setFNText(FNText)}
          />
          {!!FNError && <Text style={styles.error}>&nbsp;&nbsp;{FNError}</Text>}
        </View>
        <View style={styles.scrollView}>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="Last Name"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={LNText}
            onChangeText={LNText => setLNText(LNText)}
          />
          {!!LNError && <Text style={styles.error}>&nbsp;&nbsp;{LNError}</Text>}
        </View>
        <View style={styles.scrollView}>
          <TextInput
            mode="outlined"
            style={styles.textEntry}
            label="Email"
            autoCapitalize="none"
            selectionColor="#000000"
            activeOutlineColor="#D72C06"
            value={Email}
            onChangeText={Email => setEmail(Email)}
          />
          {!!EmailError && (
            <Text style={styles.error}>&nbsp;&nbsp;{EmailError}</Text>
          )}
        </View>
        <View style={styles.midContainer}>
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black', marginBottom: 0}}>
              Phone:{' '}
            </Text>
            <TextInputMask
              style={styles.maskedEntry}
              onChangeText={formatted => {
                setPhone(formatted);
              }}
              mask={'+1 ([000]) [000]-[0000]'}
              placeholder={'(000) 000-0000'}
              keyboardType="numeric"
              placeholderTextColor="grey"
            />
            {!!PhoneError && (
              <Text style={styles.error}>&nbsp;&nbsp;{PhoneError}</Text>
            )}
          </View>
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black'}}>Date of Birth: </Text>
            <TextInputMask
              style={styles.maskedEntry}
              onChangeText={formatted => {
                setDOB(formatted);
              }}
              mask={'[00]{/}[00]{/}[0000]'}
              placeholder={'MM/DD/YYYY'}
              keyboardType="numeric"
              placeholderTextColor="grey"
            />
            {!!DOBError && (
              <Text style={styles.error}>&nbsp;&nbsp;{DOBError}</Text>
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
            value={EMCName}
            onChangeText={EMCName => setEMCName(EMCName)}
          />
          <View style={styles.maskedInputContainer}>
            <Text style={{fontSize: 16, color: 'black'}}>E.C. Phone: </Text>
            <TextInputMask
              style={styles.maskedEntry}
              mask={'+1 ([000]) [000]-[0000]'}
              placeholder={'(000) 000-0000'}
              keyboardType="numeric"
              placeholderTextColor="grey"
              value={EMCPhone}
              onChangeText={EMCPhone => setEMCPhone(EMCPhone)}
            />
          </View>
        </View>
        <View style={styles.submissionContainer}>
          <Button
            style={styles.submissionButton}
            title="Submit"
            color="#D72C06"
            onPress={() => {
              if (!FNText.trim()) {
                setFNError('*');
              } else {
                setFNError('');
              }
              if (!LNText.trim()) {
                setLNError('*');
              } else {
                setLNError('');
              }
              if (!Email.trim()) {
                setEmailError('*');
              } else {
                setEmailError('');
              }
              if (!Phone.trim()) {
                setPhoneError('*');
              } else if (Phone.length != 17) {
                setPhoneError('X');
              } else {
                phoneValid = true;
                setPhoneError('');
              }
              if (!DOB.trim()) {
                setDOBError('*');
              } else if (DOB.length != 10) {
                setDOBError('X');
              } else {
                DOBValid = true;
                setDOBError('');
              }
              if (
                FNText.trim() &&
                LNText.trim() &&
                Email.trim() &&
                phoneValid &&
                DOBValid
              ) {
                console.log(
                  `Information List:\n First Name: ${FNText}\n Last Name: ${LNText}\n Email: ${Email}\n Phone: ${Phone}\n DOB: ${DOB}\n EMCName: ${EMCName}\n EMCPhone: ${EMCPhone}`,
                );
                //navigation.navigate('MainContainer');
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
