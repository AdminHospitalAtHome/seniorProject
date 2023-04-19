import { Platform } from 'react-native';
import React, { useState, useEffect} from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData, uploadPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';

class PulseData {
  dateString:string;
  bpm:number;
  constructor(dateString:string, bpm:number) {
    this.dateString = dateString;
    this.bpm = bpm;
  }
}

export default function PulseScreen() {
  interface Data {
    type: string;
    datetime: string;
    bpm: number;
  }
  const [data, setData] = useState<PulseData[]>([new PulseData("", 0)]);
  const [pulse, setPulse] = useState<Data[]>([]);
  const [refresh, setRefresh] = useState(false);

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
              datetime: item.endDate.toString(),
              bpm: Math.round(item.value * 100) / 100
            }
          });
          setPulse(output);
        },
      );
    }
  }

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

  useEffect(() => {
    fetchPatientData(PulseData, setData, "pulse", ["bpm"]).then(() => init());
  }, []);

  useEffect(() => {
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
      {PageHeader(() => {setRefresh(!refresh)}, "pulse")}
      {SingleValueChart(
        data.map((datum) => {
          return({
            value: datum.bpm,
            date: datum.dateString
          });
        })
        
      )}
      {DataList(
        data.map((datum, index) => {
          return(
            <ListItem
              key={index}
              title = {`${datum.bpm} bpm`}
              secondaryText = {moment(datum.dateString).format("MMMM Do YYYY, h:mm:ss a")}
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

