import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';
import Config from 'react-native-config';

export default function LoginScreen({navigation}:{navigation:any}) {
  const [emailInputValue, setEmailInputValue] = useState('');
  const [passwordInputValue, setPasswordInputValue] = useState('');
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Welcome!</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
             <TextInput
                mode="outlined"
                label={'Email'} 
                onChangeText={(data) => setEmailInputValue(data.trim())} 
                style={styles.textEntry}
              />
             <TextInput 
                mode="outlined"
                label={'Password'}
                secureTextEntry={true} 
                onChangeText={(data) => setPasswordInputValue(data.trim())} 
                style={styles.textEntry} 
              />
          </View>
          <TouchableOpacity
            style={styles.emeregencyButton}
            onPress={async () => {
              verifyLoginInfo(emailInputValue, passwordInputValue)
                .then((auth) => {
                  if (auth.length > 0) { // TODO: Update for patient/physician distinction
                    navigation.navigate('MainContainer', {
                      id:emailInputValue, 
                      password:passwordInputValue
                    });
                  }
                });
            }}>
            <Text style={styles.emeregencyText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emeregencyButton}
            onPress={() => {
              navigation.navigate('InitialSetupScreen')
            }}>
            <Text style={styles.emeregencyText}>Sign Up Instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

async function verifyLoginInfo(id:string, password:string):Promise<string> {
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
  console.log("CALLING VerifyLoginInfo AZURE FUNCTION");
  console.log("*********************************************");

  /* ------------------ */
  const url = `${Config.VERIFY_LOGIN_INFO_URL}?code=${Config.VERIFY_LOGIN_INFO_FUNCTION_KEY}`;
  const auth:string = await fetch(url, requestOptions)
    .then(response => (response.status == 403 ? "" : response.text()))
    .catch(error => "");
  return auth;
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
    alignItems: 'center',
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
    borderColor: 'black',
    padding: 5,
    margin: 10,
    width: 200,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1.3,
  },
  inputText: {
    borderColor: 'black',
    padding: 5,
    margin: 10,
    borderBottomColor: '#673AB7',
    borderBottomWidth: 1.3,
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
  },
  textEntry: {
    flex: 1,
    height: Dimensions.get('window').height * 0.09,
    width: Dimensions.get('window').width * 0.8,
    marginVertical: '3%',
  },
});