import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView, State} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

const SettingsScreen = () => {
  const [emailInputValue, setEmailInputValue] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  function saveGlobalValues(e, p) {
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (format.test(e) === false) {
        setEmailMessage('Invaild Email')
        setPasswordMessage('')
    } else if (p === '') {
        setEmailMessage('')
        setPasswordMessage('Empty Password')
    } else {
        setEmailMessage('')
        setPasswordMessage('')
        global.email[0] = e
        global.password[0] = p
        console.log('Email{' + global.email[0] + '}' + ' Password{' + global.password[0] + '}')
    }
  }

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Welcome!</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
             <TextInput placeholder={'Email'} onChangeText={(data) => setEmailInputValue(data)} style={styles.inputText} />
             <Text style={styles.formatMessage}> {emailMessage} </Text>
             <TextInput placeholder={'Password'} onChangeText={(data) => setPasswordInputValue(data)} style={styles.inputText} />
             <Text style={styles.formatMessage}> {passwordMessage} </Text>
          </View>
          <TouchableOpacity
            style={styles.emeregencyButton}
//            onPress={() => console.log('Email{' + emailInputValue + '}' + ' Password{' + passwordInputValue + '}')}
            onPress={() => saveGlobalValues(emailInputValue, passwordInputValue)}
            underlayColor="#fff">
            <Text style={styles.emeregencyText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emeregencyButton}
            onPress={() => navigation.navigate('Initial Setup Page')}
            underlayColor="#fff">
            <Text style={styles.emeregencyText}>Sign Up Instead</Text>
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
    backgroundColor: '#FFFFFF',
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
  },
  saveButton:{
    marginRight: 60,
    marginLeft:60,
    marginTop: 10,
    marginBottom: 20,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#EEEEEE',
    borderRadius:0,
    borderWidth: 0,
    borderColor: '#EEEEEE'
  },
  saveButtonText:{
    color:'#000',
    textAlign:'center',
    paddingLeft : 20,
    paddingRight : 20,
  },
  pageTitleContainer: {
    width: '100%',
    backgroundColor: '#D72C06'
  },
  pageTitle: {
    textAlign: 'center',
    font: 'signika',
    color: 'white',
    marginVertical: '5%',
    fontSize: 30,
    fontWeight: 'bold'
  },
  formatMessage: {
    color: 'red'
  }
});

export default SettingsScreen;