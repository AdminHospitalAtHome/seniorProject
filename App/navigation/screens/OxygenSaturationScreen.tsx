/*
This file contains the code for the oxygen saturation measurement screen. 
It imports components from MeasurementPageComponents.tsx to display and handle oxygen saturation data.
It displays the user's oxygen saturation data in a chart format, fetched from either Google Fit or Apple HealthKit based on the platform. 
It also allows users to upload new oxygen saturation data to their account.
*/

import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData, uploadPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
// Import AppleHealthKit and related types
// AppleHealthKit: A package to access Apple Health data on iOS devices
// HealthKitPermissions: Type for defining required permissions for accessing HealthKit data
// HealthValue: Type describing the data format returned from HealthKit
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';
import UserManager from '../../managers/UserManager';

// Define a class OxygenData to store oxygen saturation data with date and percent properties
class OxygenData {
  dateString: string;
  percent: number;
  constructor(dateString: string, percent: number) {
    this.dateString = dateString; // A string representing the date and time of the measurement
    this.percent = percent; // A number representing the oxygen saturation percentage value
  }
}

// Define the main OxygenSaturationScreen functional component
export default function OxygenSaturationScreen() {
  // Define the Data interface to store oxygen saturation data in a consistent format
  interface Data {
    type: string;
    patient: string;
    datetime: string;
    percent: number,
  }

  const [data, setData] = useState<OxygenData[]>([new OxygenData("", 0)]); // An array of OxygenData instances
  const [oxygenSaturation, setOxygenSaturation] = useState<Data[]>([]); // An array of Data instances
  const [refresh, setRefresh] = useState(false); // A boolean used to trigger a component refresh

  // Define the getOxygenSaturation function to fetch oxygen saturation data from Google Fit (Android) or HealthKit (iOS)
  // and store it in the oxygenSaturation state variable
  async function getOxygenSaturation() {
    // Platform: Detects the platform the app is running on (Android or iOS)
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };
      GoogleFit.getOxygenSaturationSamples(opt).then(res => {
        const output = res.reverse().map(item => {
          return {
            type: "oxygen saturation",
            patient: UserManager.getInstance().getId(),
            datetime: item.endDate.toString(),
            percent: Math.round(item.value * 100) / 100
          }
        });
        setOxygenSaturation(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        startDate: new Date(2017, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
      };

      AppleHealthKit.getOxygenSaturationSamples(
        options,
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return;
          }
          const output = results.map(item => {
            return {
              type: "oxygen saturation",
              patient: UserManager.getInstance().getId(),
              datetime: item.endDate.toString(),
              percent: Math.round(item.value * 100) / 100
            }
          });
          setOxygenSaturation(output);
        },
      );
    }
  }

  async function init() {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_OXYGEN_SATURATION_READ,
        ]
      };
      GoogleFit.checkIsAuthorized().then(async () => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          await getOxygenSaturation();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(async authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                await getOxygenSaturation();
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
          read: [AppleHealthKit.Constants.Permissions.OxygenSaturation],
          write: [AppleHealthKit.Constants.Permissions.OxygenSaturation],
        },
      } as HealthKitPermissions;

      AppleHealthKit.initHealthKit(permissions, async (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }
        /* Can now read or write to HealthKit */
        await getOxygenSaturation();
      });
    }
  }

  useEffect(() => {
    fetchPatientData(OxygenData, setData, "oxygen saturation", ["percent"]).then(() => init());
  }, []);

  useEffect(() => {
    const binarySearch = (arr: OxygenData[], target: string): number => {
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

    oxygenSaturation.forEach((d) => {
      const index = binarySearch(data, d.datetime);
      if (index === -1) {
        diffData.push(d);
      }
    });

    if (diffData.length > 0) {
      uploadPatientData("oxygen saturation", diffData);
    };
  }, [data]);

  // Render the OxygenSaturationScreen component using custom components and state variables
  // PageHeader: A custom header component that displays the title and a refresh button
  // SingleValueChart: A custom chart component that displays a line chart of oxygen saturation data
  // DataList: A custom list component that displays the oxygen saturation data in a scrollable list
  return (
    <React.Fragment key={"oxygen saturation"}>
      {PageHeader(() => { setRefresh(!refresh) }, "oxygen saturation")}
      {SingleValueChart(
        data.map((datum) => {
          return ({
            value: datum.percent,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return (
            <ListItem
              key={index}
              title={`${datum.percent} %  `}
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
