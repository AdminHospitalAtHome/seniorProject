import React, {useState} from 'react';

import { StyleSheet, Text, View, Dimensions,
         ScrollView, SafeAreaView } from 'react-native';
import { Button } from '@react-native-material/core';
import { TextInput } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask';

export default function InitialSetupScreen({navigation}:{navigation:any}) {

  const [text, setText] = useState("");

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Set Up Your Profile</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <TextInput
          mode='outlined'
          style={styles.textEntry}
          label="First Name"
          selectionColor='#000000'
          activeOutlineColor='#D72C06'
          />
        <TextInput
          mode='outlined'
          style={styles.textEntry}
          label="Middle Name"
          selectionColor='#000000'
          activeOutlineColor='#D72C06'
          />
        <TextInput
          mode='outlined'
          style={styles.textEntry}
          label="Last Name"
          selectionColor='#000000'
          activeOutlineColor='#D72C06'
          />
        <TextInput
          mode='outlined'
          style={styles.textEntry}
          label="Email"
          selectionColor='#000000'
          activeOutlineColor='#D72C06'
          />
        <View style={styles.maskedInputContainer}>
          <Text style={{fontSize: 16, color: 'black'}}>Phone: </Text>
          <TextInputMask
            style={styles.maskedEntry}
            mask={'+1 ([000]) [000]-[0000]'}
            placeholder={'(000) 000-0000'}
            keyboardType="numeric"
            placeholderTextColor="grey"/>
        </View>
        <View style={styles.maskedInputContainer}>
          <Text style={{fontSize: 16, color: 'black'}}>Birthday: </Text>
          <TextInputMask
            style={styles.maskedEntry}
            mask={'[00]{/}[00]{/}[0000]'}
            placeholder={'MM/DD/YYYY'}
            keyboardType="numeric"
            placeholderTextColor="grey"/>
        </View>
        <Text style={styles.sectionHeader}>Emergency Contact Information</Text>
        <TextInput
          mode='outlined'
          style={styles.textEntry}
          label="Emergency Contact Name"
          selectionColor='#000000'
          activeOutlineColor='#D72C06'
          />
        <View style={styles.maskedInputContainer}>
          <Text style={{fontSize: 16, color: 'black'}}>E.C. Phone: </Text>
          <TextInputMask
            style={styles.maskedEntry}
            mask={'+1 ([000]) [000]-[0000]'}
            placeholder={'(000) 000-0000'}
            keyboardType="numeric"
            placeholderTextColor="grey"/>
        </View>
        <View style={styles.submissionContainer}>
          <Button
            style={styles.submissionButton}
            title="Submit"
            color='#D72C06'
            onPress={() => navigation.navigate('MainContainer')}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create ({
  pageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  scrollView: {

  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center'
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
  sectionHeader: {
    font: 'signika',
    fontSize: 20,
    fontWeight: 'bold'
  },
  textEntry: {
    height: Dimensions.get('window').height * 0.07,
    width: Dimensions.get('window').width * 0.8,
    marginVertical: '3%'
  },
  maskedInputContainer: {
    width: Dimensions.get('window').width * 0.8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%'
  },
  maskedEntry: {
    font: 'signika',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'grey'
  },
  submissionContainer: {
    width: Dimensions.get('window').width * 0.8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  submissionButton: {
    width: Dimensions.get('window').width * 0.3
  }
});