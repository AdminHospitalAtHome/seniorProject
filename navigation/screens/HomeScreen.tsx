/* eslint-disable prettier/prettier */
import * as React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';

// import Boxes from './Boxes';

export default function HomeScreen({navigation}:{navigation:any}) {
  return (
    <ScrollView style={styles.pageContainer}>
            <View style={styles.box}>
                <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Pulse')}>
                    <Text style={{color:'black'}}>Pulse</Text>
                </View>
            </View>

            <View style={styles.box}>
                <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Blood Pressure')}>
                    <Text style={{color:'black'}}>Blood Pressure</Text>
                </View>
            </View>

            <View style={styles.box}>
                <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Weight')}>
                    <Text style={{color:'black'}}
                   >Weight</Text>
                </View>
            </View>

            <View style={styles.box}>
                <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Temperature')}>
                    <Text style={{color:'black'}}>Temperature</Text>
                </View>
            </View>

            <View style={styles.box}>
                <View style={styles.inner}  onStartShouldSetResponder={() => navigation.navigate('Oxygen Saturation')}>
                      <Text style={{color:'black'}}>Oxygen Saturation</Text>
                </View>
            </View>

            <View style={styles.box}>
                <View style={styles.inner}>
                    <Text style={{color:'black'}}>Whatever</Text>
                </View>
            </View>

            <View style={styles.lastBox}>
                <View style={styles.inner}>
                    <Text style={{color:'black'}}>Whatever</Text>
                </View>
            </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create ({
    pageContainer: {
    alignContent:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  box: {
    
    height: '20%',
    padding: 19,
  },
  lastBox: {
    height: '20%',
    padding: 19,
    marginBottom: 19,
  },
  inner: {
    height: '120%',
    width: 350,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  }
});
