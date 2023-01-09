import {
  Platform,
  Alert,
  Pressable,
  Modal,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import {
  TextInput,
  ListItem,
  Surface,
  Stack,
  Button,
} from '@react-native-material/core';
import {LineChart} from 'react-native-chart-kit';
//import CheckBox from '@react-native-community/checkbox';
//import moment from 'moment';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
//global.dataSet = [];
const datas = [
  {Date: '2022-10-13T19:31:00.000Z', value: 88},
  {Date: '2022-10-24T19:35:00.000Z', value: 89},
  {Date: '2022-10-25T20:11:00.000Z', value: 87},
  {Date: '2022-10-27T19:20:00.000Z', value: 90},
  {Date: '2022-10-28T02:48:00.000Z', value: 89},
  {Date: '2022-10-29T19:31:00.000Z', value: 88},
  {Date: '2022-10-30T19:35:00.000Z', value: 89},
  {Date: '2022-10-31T20:11:00.000Z', value: 87},
  {Date: '2022-11-1T19:20:00.000Z', value: 90},
  {Date: '2022-11-2T02:48:00.000Z', value: 89},
  {Date: '2022-11-3T03:48:00.000Z', value: 91},
];

//var test = '2022-11-3T03:48:00.000Z';
//console.log("date: " + Moment(test).format('d MMM'));

async function getPulse() {
  //const [result, setResult] = useState([]);
  if (Platform.OS === 'android') {
    var today = new Date();
    var lastMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );
    const opt = {
      startDate: lastMonthDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(),
      //               unit: 'kg', // required; default 'kg'
      bucketUnit: 'HOUR', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
      // ascending: true, // optional; default false
    };
    //const res = await GoogleFit.getHeartRateSamples(opt);
    GoogleFit.getHeartRateSamples(opt).then(res => {
      console.log(res.reverse());
      //global.dataSet = res;
    });
  } else if (Platform.OS === 'ios') {
    let options = {
      unit: 'bpm', // optional; default 'bpm'
      startDate: new Date(2021, 0, 0).toISOString(), // required
      endDate: new Date().toISOString(), // optional; default now
      ascending: false, // optional; default false
      //limit: 10, // optional; default no limit
    };

    AppleHealthKit.getHeartRateSamples(
      options,
      (err: Object, results: Array<HealthValue>) => {
        if (err) {
          return;
        }
        console.log(results);
      },
    );
  }
}

function init() {
  if (Platform.OS === 'android') {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_HEART_RATE_READ,
        Scopes.FITNESS_HEART_RATE_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ],
    };
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        getPulse();
        //console.log("Outside Data: " + global.dataSet);
        //console.log("Out Data1: " + global.dataSet1);
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');

              // if successfully authorized, fetch data
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch(() => {
            dispatch('AUTH_ERROR');
          });
      }
    });
  } else if (Platform.OS === 'ios') {
    const permissions = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.HeartRate],
        write: [AppleHealthKit.Constants.Permissions.HeartRate],
      },
    } as HealthKitPermissions;

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      /* Called after we receive a response from the system */

      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }
      /* Can now read or write to HealthKit */
      getPulse();
    });
  }
}

export default function PulseScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const values = datas.map(data => data.value);
  const dates = datas.map(data =>
    Array.from(data.Date)[9] == 'T'
      ? data.Date.substring(5, 9)
      : data.Date.substring(5, 10),
  );
  // console.log(dates);
  init();
  return (
    <ScrollView>
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
                     value={isMSelected}
                     onValueChange={setMSelection}
                     style={styles.checkbox}
                    />
                   <Text style={styles.label}>Monthly</Text>
                   <CheckBox
                      value={isWSelected}
                      onValueChange={setWSelection}
                      style={styles.checkbox}
                      />
                   <Text style={styles.label}>Weekly</Text>
                   <CheckBox
                      value={isDSelected}
                      onValueChange={setDSelection}
                      style={styles.checkbox}
                      /> */}
        {/* <Text style={styles.label}>Daily</Text> */}

        <Button style={styles.plus} onPress={() => init()} title="Sync" />
        <View style={styles.space} />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Enter New Measurement Below
                </Text>
                <TextInput
                  style={styles.inputText}
                  label="New Measurement"
                  variant="standard"
                />
                <View style={styles.buttonView}>
                  <Pressable
                    style={[styles.button2, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Done</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button2, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Pressable
            style={[styles.button0, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>+</Text>
          </Pressable>
        </View>
      </View>
      <LineChart
        data={{
          labels: dates,
          datasets: [
            {
              data: values,
              //                      Math.random() * 100,
              //                      Math.random() * 100,
              //                      Math.random() * 100,
              //                      Math.random() * 100,
              //                      Math.random() * 100,
              //                      Math.random() * 100,
            },
            {data: [150], withDots: false},
          ],
        }}
        //yLabelsOffset={20}
        //xLabelsOffset={100}
        segments={6}
        fromZero={true}
        width={Dimensions.get('window').width - 16} // from react-native
        height={220}
        //xAxisInterval={230}
        yAxisLabel={''}
        verticalLabelRotation={-70}
        xLabelsOffset={10}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          //color: () => 'transparent',
          //textAnchor="middle"
          //propsForHorizontalLabels=[textAnchor="middle"],
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <Button title="Press Generate to View" />
      <Stack fill center spacing={4}>
        {datas.map(data => {
          return (
            <Surface
              key={data.Date}
              elevation={2}
              category="medium"
              style={{width: 370, height: 70}}>
              <ListItem
                title={data.value}
                //secondaryText={moment(data.Date).format("dddd, MMM DD at HH:mm a")}
                secondaryText={data.Date}
              />
            </Surface>
          );
        })}
      </Stack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  plus: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    fontSize: 5,
  },
  plus2: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    fontSize: 5,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },

  space: {
    width: 5, // or whatever size you need
    height: 15,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button0: {
    borderRadius: 8,
    width: 40,
    padding: 10,
    elevation: 2,
  },
  button1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    width: 130,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'grey',
  },
  buttonClose: {
    backgroundColor: 'grey',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    fontSize: 19,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'space-evenly',
  },
  inputText: {
    backgroundColor: '#D3D3D3',
    margin: 10,
    width: 300,
    padding: 10,
  },
});
