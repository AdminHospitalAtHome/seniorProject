import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, DoubleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';

class BloodpressureData {
  dateString: string;
  systolic: number;
  diastolic: number;
  constructor(dateString: string, systolic: number, diastolic: number) {
    this.dateString = dateString;
    this.systolic = systolic;
    this.diastolic = diastolic;
  }
}

export default function BloodPressureScreen({ route }: { route: any }) {
  interface Data {
    type: string;
    patient: any;
    datetime: string;
    systolic: number,
    diastolic: number,
  }
  const { id, password } = route.params;
  const [data, setData] = useState<BloodpressureData[]>([new BloodpressureData("", 0, 0)]);
  const [bloodPressure, setBloodPressure] = useState<Data[]>([]);

  async function getBloodPressure() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        bucketInterval: 1, // optional - default 1.
        ascending: true, // optional; default false
      };
      GoogleFit.getBloodPressureSamples(opt).then(res => {
        const output = res.map(item => {
          //const date = moment(item.endDate);
          return {
            type: "blood pressure",
            patient: id,
            datetime: item.endDate.toString(),
            systolic: Math.round(item.systolic * 100) / 100,
            diastolic: Math.round(item.diastolic * 100) / 100
          }
        });
        setBloodPressure(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
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

  async function init() {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
          Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        ]
      };
      GoogleFit.checkIsAuthorized().then(() => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          getBloodPressure();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                getBloodPressure();
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
        getBloodPressure();
      });
    }
  }

  useEffect(() => {
    init();
    fetchPatientData(id, password, BloodpressureData, setData, "blood pressure", ["systolic", "diastolic"]);
  }, []);

  useEffect(() => {
    console.log("Blood Pressure: " + JSON.stringify(bloodPressure));
    console.log("database: " + JSON.stringify(data));

    const binarySearch = (arr: BloodpressureData[], target: string): number => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (arr[middle].dateString === target) {
          return middle;
        } else if (arr[middle].dateString < target) {
          left = middle + 1;
        } else {
          right = middle - 1;
        }
      }

      return -1;
    };

    const diffData: Data[] = [];

    bloodPressure.forEach((d) => {
      const index = binarySearch(data, d.datetime);
      if (index === -1) {
        diffData.push(d);
      }
    });

    console.log("different: " + JSON.stringify(diffData));
    //uploadPatientData(id, password, "blood pressure", diffData);
  }, [data]);

  return (
    <React.Fragment key={"blood pressure"}>
      {PageHeader()}
      {DoubleValueChart(
        data.map((datum) => {
          return ({
            first_value: datum.systolic,
            second_value: datum.diastolic,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return (
            <ListItem
              key={index}
              title={`${datum.systolic} mmHg       ${datum.diastolic} mmHg`}
              secondaryText={datum.dateString}
            />
          );
        })
      )}
    </React.Fragment>
  );
}

function dispatch(arg0: string) {
  throw new Error('Function not implemented.');
}
