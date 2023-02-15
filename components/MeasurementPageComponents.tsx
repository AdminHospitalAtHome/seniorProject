import { Stack, Surface, Button, TextInput } from "@react-native-material/core";
import moment from "moment";
import React, { useState } from "react";
import { Dimensions, ScrollView, View, Modal, Text, Pressable, StyleSheet, Alert } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import Config from 'react-native-config';
import { CLIENT_RENEG_LIMIT } from "tls";

export function DataList(listItems: any[]) {
  return (
    <ScrollView>
      <Stack fill center spacing={4}>
        {listItems.map((listItem: any) => {
          return (
            <Surface
              key={listItem.key}
              elevation={2}
              category="medium"
              style={{ width: 370, height: 70 }}>
              {listItem}
            </Surface>
          );
        })};
      </Stack>
    </ScrollView>
  );
}

export function SingleValueChart(entries: any[]) {
  return (
    <LineChart
      data={{
        labels: entries.map((entry) =>
          moment(entry.date).format('MM-DD').toString()
        ),
        datasets: [
          {
            data: entries.map((entry) => {
              return (entry.value);
            }),
          }, { data: [150], withDots: false, }, // TODO: Find a better way of doing this
        ],
      }}
      segments={6}
      fromZero={true}
      width={Dimensions.get('window').width - 16} // from react-native
      height={220}
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
  );
}

export function DoubleValueChart(entries: any[]) {
  return (
    <LineChart
      data={{
        labels: entries.map((entry) => Array.from(entry.date)[9] == 'T' ?
          entry.date.substring(5, 9) :
          entry.date.substring(5, 10)),
        datasets: [
          {
            data: entries.map((entry) => {
              return (entry.first_value);
            }),
            color: (opacity = 1) => `rgba(0,0,110, ${opacity})`
          },
          {
            data: entries.map((entry) => {
              return (entry.second_value);
            }),
            color: (opacity = 1) => `rgba(0,100,176, ${opacity})`
          }, { data: [150], withDots: false, }, // TODO: Find a better way of doing this
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
        strokeWidth: 6,
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
  );
}


interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader(setRefresh: () => void) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.checkboxContainer}>
      <Button
        style={styles.plus}
        onPress={setRefresh}
        title="Sync"
      />
    </View>
  );
}

export async function uploadPatientData(id: string, password: string, type: string, newDataJSON: object) {
  const Buffer = require("buffer").Buffer;
  let encodedAuth = new Buffer(id + ":" + password).toString("base64");

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Basic ${encodedAuth}`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(newDataJSON)
  };
  console.log("*********************************************");
  console.log("CALLING UploadPatientMeasurements AZURE FUNCTION");
  console.log("*********************************************");

  /* ------------------ */
  const url = `${Config.UPLOAD_PATIENT_MEASUREMENTS_URL}?code=${Config.UPLOAD_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=${type}`;
  fetch(url, requestOptions)
    .then(response => response.text())
    .catch(error => console.log('error', error));

}

export async function fetchPatientData(id:any, password: any, MeasureData: any, setData: any, type: any, unit: any[], patientId:string) {
  // const { id, password, TemperatureData, setData } = route.params;
  /* TODO: Abstract out */
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
  console.log("CALLING GetPatientMeasurements AZURE FUNCTION");
  console.log("*********************************************");

  /* ------------------ */
  const url = `${Config.GET_PATIENT_MEASUREMENTS_URL}?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=${type}`
    + `&patient=${patientId}`;
  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then(arr => {
      const fetched = [];
      for (var obj of arr) {
        if (type == "blood pressure") {
          fetched.push(new MeasureData(obj.datetime, obj[unit[0]], obj[unit[1]]));
        } else
          fetched.push(new MeasureData(obj.datetime, obj[unit[0]]));
      }
      setData(fetched);
    })
    .catch(error => console.log('error', error));

}

const styles = StyleSheet.create({
  plus: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    fontSize: 5,
    marginRight: 10
  },
  plus2: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    fontSize: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  checkbox: {
    alignSelf: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button0: {
    borderRadius: 8,
    width: 40,
    padding: 10,
    elevation: 2
  },
  button1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    width: 130,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "grey",
  },
  buttonClose: {
    backgroundColor: "grey",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    color: "black",
    fontSize: 19,
    marginBottom: 15,
    textAlign: "center"
  },
  buttonView: {
    flexDirection: "row", marginLeft: 20, justifyContent: 'space-evenly'
  },
  inputText: {
    backgroundColor: "#D3D3D3",
    margin: 10,
    width: 300,
    padding: 10,
  },
});