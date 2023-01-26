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
import React, { useState, useEffect, Component } from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config';
import { ListItem } from '@react-native-material/core';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';


class WeightData {
  dateString:string;
  lbs:number;
  constructor(dateString:string, lbs:number) {
    this.dateString = dateString;
    this.lbs = lbs;
  }
}

export default function WeightScreen({route}:{route:any}) {
  const { id, password } = route.params;
  const [data, setData] = useState<WeightData[]>([]);
  const [weight, setWeight] = useState('');
  const [refresh, setRefresh] = useState(1);
  var weightStr = '';
  function getWeight() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        unit: 'pound', // required; default 'kg'
        bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
        bucketInterval: 1, // optional - default 1.
        ascending: true, // optional; default false
      };
      //const res = await GoogleFit.getHeartRateSamples(opt);
      GoogleFit.getWeightSamples(opt).then(res => {
        weightStr = JSON.stringify(res);
        //pulseStr = res[0].startDate;
        //const date0 = moment(res[1].startDate);
        //const date1 = moment(pulseStr);
        setWeight(weightStr);
        console.log("result:"+weight);
        // if(date1.isBefore(date0)){
        //   console.log("answer: true");
        // }
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        unit: 'bpm', // optional; default 'bpm'
        startDate: new Date(2021, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
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
          Scopes.FITNESS_HEART_RATE_READ,
          Scopes.FITNESS_BODY_READ,
        ],
      };
      GoogleFit.checkIsAuthorized().then(() => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: "+authorized);
        if (authorized) {
          getWeight();
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
        getWeight();
      });
    }
  }
  init();


  useEffect(() => {
    // async function fetchPatientData() {
    //   /* TODO: Abstract out */
    //   const Buffer = require("buffer").Buffer;
    //   let encodedAuth = new Buffer(id + ":" + password).toString("base64");
    //   var myHeaders = new Headers();
    //   myHeaders.append("Authorization", `Basic ${encodedAuth}`);

    //   var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     redirect: 'follow'
    //   };
    //   console.log("*********************************************");
    //   console.log("CALLING GetPatientMeasurements AZURE FUNCTION");
    //   console.log("*********************************************");

    //   /* ------------------ */
    //   const url = `${Config.GET_PATIENT_MEASUREMENTS_URL}?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=weight`;
    //   fetch(url, requestOptions)
    //     .then(response => response.text())
    //     .then(result => JSON.parse(result).feed)
    //     .then(arr => {
    //       const fetched = [];
    //       for (var obj of arr) {
    //         fetched.push(new WeightData(obj.datetime, obj.lbs));
    //       }
    //       setData(fetched);
    //     })
    //     .catch(error => console.log('error', error));
    // }
    fetchPatientData(id,password,WeightData,setData, "weight",  ["lbs"]);
  }, []);

  return (
    <React.Fragment key={"weight"}>
      {PageHeader()}
      {SingleValueChart(
        data.map((datum) => {
          return({
            value: datum.lbs,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return(
            <ListItem
              key={index}
              title = {`${datum.lbs} lbs`}
              secondaryText = {datum.dateString}
            />
          );
        })
      )}
    </React.Fragment>
  );
}
