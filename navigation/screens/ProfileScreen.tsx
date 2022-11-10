/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text, TextInput, Image, Button, Alert, TouchableOpacity, ScrollView} from 'react-native';

export default function SettingsScreen({navigation}) {
  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Image
            source={require('./profile.png')} 
            style={styles.profileImage} 
            />
          <View style={styles.nameBox}>
            <TextInput style={styles.inputTextTop} placeholder='First Name' placeholderTextColor='#000'/>
            <TextInput style={styles.inputTextTop} placeholder='Last Name' placeholderTextColor='#000'/>
          </View>
        </View>
        <View style={styles.lowContainer}>
          <View style={styles.infoContainer}>
            <TextInput style={styles.inputText} placeholder="Email" placeholderTextColor='#000'/>
            <TextInput style={styles.inputText} keyboardType="numeric" placeholder="Phone" placeholderTextColor='#000'/>
            <TextInput style={styles.inputText} placeholder="Birthday" placeholderTextColor='#000'/>
            <TextInput style={styles.inputText} placeholder="Gender" placeholderTextColor='#000'/>
          </View>
          <TouchableOpacity
              style={styles.emeregencyButton}
              onPress={() => Alert.alert('Calling Front Desk')}
              underlayColor="#fff">
              <Text style={styles.emeregencyText}>Call Front Desk</Text>
            </TouchableOpacity>
          <View style={styles.emergencyContainer}>
            <TextInput style={styles.inputText} placeholder="Emergency Contact Name" placeholderTextColor='#000'/>
            <TextInput style={styles.inputText} keyboardType="numeric" placeholder="Emergency Contact Phone" placeholderTextColor='#000'/>
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