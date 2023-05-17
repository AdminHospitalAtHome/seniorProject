/*
This file contains the code for the pulse measurement screen. 
It imports components from MeasurementPageComponents.tsx to display and handle pulse data.
It displays the user's pulse data in a chart format, fetched from either Google Fit or Apple HealthKit based on the platform. 
It also allows users to upload new pulse data to their account.
*/

import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData, uploadPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';
import UserManager from '../../managers/UserManager';

// This class will be used to store individual heart rate data points with their respective date and value (beats per minute).
class PulseData {
  dateString: string;
  bpm: number;
  constructor(dateString: string, bpm: number) {
    this.dateString = dateString;
    this.bpm = bpm;
  }
}

// Define the PulseScreen component which renders the UI and handles data fetching and display.
// This component is responsible for fetching heart rate data from Google Fit (Android) or Apple HealthKit (iOS) and displaying it in a chart.
export default function PulseScreen() {
  //  This interface will be used to format the fetched data from Google Fit or Apple HealthKit.
  interface Data {
    type: string;
    patient: string;
    datetime: string;
    bpm: number;
  }
  const [data, setData] = useState<PulseData[]>([]);
  const [pulse, setPulse] = useState<Data[]>([]);
  const [refresh, setRefresh] = useState(false);

  // This function is called during the component's initialization to fetch the necessary data.
  async function getPulse() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        unit: 'bpm', // required;
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };
      GoogleFit.getHeartRateSamples(opt).then(res => {
        const output = res.reverse().map(item => {
          return {
            type: "pulse",
            patient: UserManager.getInstance().getId(),
            datetime: item.endDate.toString(),
            bpm: Math.round(item.value * 100) / 100
          }
        });
        setPulse(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        startDate: new Date(2017, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
      };

      AppleHealthKit.getHeartRateSamples(
        options,
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return;
          }
          const output = results.map(item => {
            return {
              type: "pulse",
              patient: UserManager.getInstance().getId(),
              datetime: item.endDate.toString(),
              bpm: Math.round(item.value * 100) / 100
            }
          });
          setPulse(output);
        },
      );
    }
  }

  //  Define a function called init() which handles the initialization of Google Fit or Apple HealthKit depending on the platform (Android or iOS).
  // This function checks whether authorization is granted and fetches the heart rate data, calling the getPulse() function.
  async function init() {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_HEART_RATE_READ,
        ],
      };
      GoogleFit.checkIsAuthorized().then(async () => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          await getPulse();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(async authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                await getPulse();
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

      AppleHealthKit.initHealthKit(permissions, async (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }
        /* Can now read or write to HealthKit */
        await getPulse();
      });
    }
  }

  const binarySearch = (arr: PulseData[], target: string): number => {
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

  // Call the useEffect() hook to fetch heart rate data when the component is mounted.
  useEffect(() => {
    init().then(() => fetchPatientData(PulseData, setData, "pulse", ["bpm"]));
  }, [refresh]);

  useEffect(() => {
    if (!UserManager.getInstance().isPatient()) {
      return;
    }


    const diffData: Data[] = [];
    pulse.forEach((d) => {
      const index = binarySearch(data, d.datetime);
      if (index === -1) {
        diffData.push(d);
      }
    });
    if (diffData.length > 0) {
      uploadPatientData("pulse", diffData);
    };
  }, [data]);


  return (
    <React.Fragment key={"pulse"}>
      {PageHeader((() => { setRefresh(!refresh) }), "pulse")}
      {SingleValueChart(
        data.map((datum) => {
          return ({
            value: datum.bpm,
            date: datum.dateString
          });
        })

      )}
      {DataList(
        data.map((datum, index) => {
          return (
            <ListItem
              key={index}
              title={`${datum.bpm} bpm`}
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

