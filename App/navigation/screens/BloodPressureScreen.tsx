/*
This file contains the code for the blood pressure measurement screen. 
It imports components from MeasurementPageComponents.tsx to display and handle blood pressure data.
It fetches the blood pressure data from the UserManager and displays it in the appropriate components.
*/

import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, DoubleValueChart, fetchPatientData, uploadPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { BloodPressureSampleValue, HealthKitPermissions, HealthValue } from 'react-native-health';
// Import UserManager from '../../managers/UserManager' for managing user data and authentication
import UserManager from '../../managers/UserManager';

// Define BloodpressureData class to store blood pressure readings with date, systolic, and diastolic values
class BloodpressureData {
  dateString: string;
  systolic: number;
  diastolic: number;
  // Constructor for BloodpressureData class, initializing its properties with provided values
  constructor(dateString: string, systolic: number, diastolic: number) {
    this.dateString = dateString;
    this.systolic = systolic;
    this.diastolic = diastolic;
  }
}

// Export default function BloodPressureScreen for rendering the blood pressure screen
export default function BloodPressureScreen() {
  interface Data {
    type: string;
    patient: string;
    datetime: string;
    systolic: number,
    diastolic: number,
  }
  const [data, setData] = useState<BloodpressureData[]>([new BloodpressureData("", 0, 0)]);
  const [bloodPressure, setBloodPressure] = useState<Data[]>([]);
  const [refresh, setRefresh] = useState(false);

  async function getBloodPressure() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };
      GoogleFit.getBloodPressureSamples(opt).then(res => {
        const output = res.reverse().map(item => {
          return {
            type: "blood pressure",
            patient: UserManager.getInstance().getId(),
            datetime: item.endDate.toString(),
            systolic: Math.round(item.systolic * 100) / 100,
            diastolic: Math.round(item.diastolic * 100) / 100
          }
        });
        setBloodPressure(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        startDate: new Date(2017, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
      };

      AppleHealthKit.getBloodPressureSamples(
        options,
        (err: Object, results: Array<BloodPressureSampleValue>) => {
          if (err) {
            return;
          }
          const output = results.map(item => {
            return {
              type: "blood pressure",
              patient: UserManager.getInstance().getId(),
              datetime: item.endDate.toString(),
              systolic: Math.round(item.bloodPressureSystolicValue * 100) / 100,
              diastolic: Math.round(item.bloodPressureDiastolicValue * 100) / 100
            }
          });
          setBloodPressure(output);
        },
      );
    }
  }

  // Define init function to initialize and authorize Google Fit or Apple HealthKit based on the platform and fetch blood pressure data
  async function init() {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
        ]
      };
      GoogleFit.checkIsAuthorized().then(async () => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          await getBloodPressure();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(async authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                await getBloodPressure();
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
          read: [AppleHealthKit.Constants.Permissions.BloodPressureSystolic, AppleHealthKit.Constants.Permissions.BloodPressureDiastolic],
          write: [AppleHealthKit.Constants.Permissions.BloodPressureSystolic, AppleHealthKit.Constants.Permissions.BloodPressureDiastolic],
        },
      } as HealthKitPermissions;

      AppleHealthKit.initHealthKit(permissions, async (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }
        /* Can now read or write to HealthKit */
        await getBloodPressure();
      });
    }
  }

  // Call init function on component mount to fetch blood pressure data and set state
  useEffect(() => {
    fetchPatientData(BloodpressureData, setData, "blood pressure", ["systolic", "diastolic"]).then(() => init());
  }, []);

  useEffect(() => {
    const binarySearch = (arr: BloodpressureData[], target: string): number => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (arr[middle].dateString === target) {
          return middle;
        } else if (arr[middle].dateString > target) {
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

    if (diffData.length > 0) {
      uploadPatientData("blood pressure", diffData);
    };
  }, [data]);

  // Render the blood pressure data in a chart and list using imported components and state variables 
  return (
    <React.Fragment key={"blood pressure"}>
      {PageHeader(() => { setRefresh(!refresh) }, "blood pressure")}
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
              secondaryText={moment(datum.dateString).format("MMMM Do YYYY, h:mm:ss a")}
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

// Please note that for a complete understanding of the code, it's essential to also review the code and comments in the imported files like MeasurementPageComponents.tsx, UserManager.tsx, and Patient.tsx. 
