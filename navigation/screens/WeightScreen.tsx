import {
  Platform,
} from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
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
  interface Data {
    type: string;
    patient: any;
    datetime: string;
    lbs: number;
  }
  const { id, password } = route.params;
  const [data, setData] = useState<WeightData[]>([]);
  const [weight, setWeight] = useState<Data[]>([]);
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
      GoogleFit.getWeightSamples(opt).then(res => {
        
        const output =res.map(item => {
          const date = moment(item.endDate);
          return {
            type:"weight",
            patient:id,
            //datetime:date.format('MMM DD, YYYY hh:mm:ss'),
            datetime:item.endDate.toString(),
            lbs: item.value
          }
        });
        //console.log("output: "+JSON.stringify(output));
        setWeight(output);
        //console.log("output:"+JSON.stringify(res));
        //console.log("weight:"+JSON.stringify(weight));
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
                getWeight();
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

  //init();
  useEffect(() => {
    fetchPatientData(id, password, WeightData, setData, "weight", ["lbs"]);
    init(); 
  }, []);

  useEffect(() => {
    console.log("weight: " + JSON.stringify(weight));
    //console.log("database: " + JSON.stringify(data));
    const diffData = weight.filter(item1 => {
      return !data.some(item2 => item2['dateString'] === item1['datetime']);
    });
    console.log("different: " + JSON.stringify(diffData));
  }, [weight]);

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
