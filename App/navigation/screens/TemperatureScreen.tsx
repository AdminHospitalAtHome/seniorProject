import { Platform } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart, fetchPatientData, uploadPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';

class TemperatureData {
  dateString: string;
  degree: number;
  constructor(dateString: string, degree: number) {
    this.dateString = dateString;
    this.degree = degree;
  }
}

export default function TemperatureScreen() {
  interface Data {
    type: string;
    datetime: string;
    degree: number,
  }
  const [data, setData] = useState<TemperatureData[]>([new TemperatureData("", 0)]);
  const [temperature, setTemperature] = useState<Data[]>([]);
  const [refresh, setRefresh] = useState(false);

  async function getTemperature() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };
      GoogleFit.getBodyTemperatureSamples(opt).then(res => {
        const output = res.reverse().map(item => {
          return {
            type: "temperature",
            datetime: item.endDate.toString(),
            degree: Math.round(item.value * 100) / 100
          }
        });
        setTemperature(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        startDate: new Date(2017, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
      };

      AppleHealthKit.getBodyTemperatureSamples(
        options,
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return;
          }
          const output = results.map(item => {
            return {
              type: "temperature",
              datetime: item.endDate.toString(),
              degree: Math.round(item.value * 100) / 100
            }
          });
          setTemperature(output);
        },
      );
    }
  }

  async function init() {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_BODY_TEMPERATURE_READ,
        ]
      };
      GoogleFit.checkIsAuthorized().then(async () => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          await getTemperature();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(async authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                await getTemperature();
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
          read: [AppleHealthKit.Constants.Permissions.BodyTemperature],
          write: [AppleHealthKit.Constants.Permissions.BodyTemperature],
        },
      } as HealthKitPermissions;

      AppleHealthKit.initHealthKit(permissions, async (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }
        /* Can now read or write to HealthKit */
        await getTemperature();
      });
    }
  }

  useEffect(() => {
    fetchPatientData(TemperatureData, setData, "temperature", ["degree"]).then(() => init());
  }, []);

  useEffect(() => {
    const binarySearch = (arr: TemperatureData[], target: string): number => {
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

    temperature.forEach((d) => {
      const index = binarySearch(data, d.datetime);
      if (index === -1) {
        diffData.push(d);
      }
    });

    if (diffData.length > 0) {
      uploadPatientData("temperature", diffData);
    };
  }, [data]);

  return (
    <React.Fragment key={"temperature"}>
      {PageHeader(() => {setRefresh(!refresh)})}
      {SingleValueChart(
        data.map((datum) => {
          return ({
            value: datum.degree,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return (
            <ListItem
              key={index}
              title={`${datum.degree} ${'\u00b0'}F  `}
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
