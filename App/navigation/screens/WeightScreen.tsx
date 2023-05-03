import { Platform, RefreshControl, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData, uploadPatientData, } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, { HealthKitPermissions, HealthValue, } from 'react-native-health';
import { ScrollView } from 'react-native-gesture-handler';
import UserManager from '../../managers/UserManager';

class WeightData {
  dateString: string;
  lbs: number;
  constructor(dateString: string, lbs: number) {
    this.dateString = dateString;
    this.lbs = lbs;
  }
}

export default function WeightScreen() {
  interface Data {
    type: string;
    patient: string;
    datetime: string;
    lbs: number;
  }
  const [data, setData] = useState<WeightData[]>([]);
  const [weight, setWeight] = useState<Data[]>([]);
  const [refresh, setRefresh] = useState(false);

  async function getWeight() {
    if (Platform.OS === 'android') {
      var today = new Date();
      const opt = {
        startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
        endDate: today.toISOString(),
        unit: 'pound', // required; default 'kg'
        bucketInterval: 1, // optional - default 1.
        ascending: false, // optional; default false
      };
      GoogleFit.getWeightSamples(opt).then(res => {
        const output = res.reverse().map(item => {
          return {
            type: "weight",
            patient: UserManager.getInstance().getId(),
            datetime: item.endDate.toString(),
            lbs: Math.round(item.value * 100) / 100
          }
        });
        setWeight(output);
      });
    } else if (Platform.OS === 'ios') {
      let options = {
        startDate: new Date(2017, 0, 0).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
      };

      AppleHealthKit.getWeightSamples(
        options,
        (err: Object, results: Array<HealthValue>) => {
          if (err) {
            return;
          }
          const output = results.map(item => {
            return {
              type: "weight",
              patient: UserManager.getInstance().getId(),
              datetime: item.endDate.toString(),
              lbs: Math.round(item.value * 100) / 100
            }
          });
          //console.log("output: "+JSON.stringify(output));
          setWeight(output);
        },
      );
    }
  }

  async function init() {
    if (!UserManager.getInstance().isPatient()) {
      return;
    }
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_BODY_READ,
        ],
      };
      GoogleFit.checkIsAuthorized().then(async () => {
        var authorized = GoogleFit.isAuthorized;
        console.log("Status: " + authorized);
        if (authorized) {
          await getWeight();
        } else {
          // Authentication if already not authorized for a particular device
          GoogleFit.authorize(options)
            .then(async authResult => {
              if (authResult.success) {
                console.log('AUTH_SUCCESS');
                // if successfully authorized, fetch data
                await getWeight();
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
          read: [AppleHealthKit.Constants.Permissions.Weight],
          write: [AppleHealthKit.Constants.Permissions.Weight],
        },
      } as HealthKitPermissions;

      AppleHealthKit.initHealthKit(permissions, async (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
          console.log('[ERROR] Cannot grant permissions!');
        }
        /* Can now read or write to HealthKit */
        await getWeight();
      });
    }
  }

  const binarySearch = (arr: WeightData[], target: string): number => {
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

  useEffect(() => {
    init().then(() => fetchPatientData(WeightData, setData, "weight", ["lbs"]));
  }, [refresh]);

  useEffect(() => {    
    const diffData: Data[] = [];
    weight.forEach((d) => {
      const index = binarySearch(data, d.datetime);
      if (index === -1) {
        diffData.push(d);
      }
    });
    if (diffData.length > 0) {
      uploadPatientData("weight", diffData);
    };
  }, [data]);

    return (
      <React.Fragment key={"weight"}>
        {PageHeader((() => { setRefresh(!refresh) }), "weight")}
        {SingleValueChart(
          data.map((datum) => {
            return ({
              value: datum.lbs,
              date: datum.dateString
            });
          })
        )}
        {DataList(
          data.map((datum, index) => {
            return (
              <ListItem
                key={index}
                title={`${datum.lbs} lbs`}
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

