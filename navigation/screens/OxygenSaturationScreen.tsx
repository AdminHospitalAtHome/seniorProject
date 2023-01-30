import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
import { initialWindowMetrics } from 'react-native-safe-area-context';

class OxygenData {
    dateString:string;
    percent:number;
    constructor(dateString:string, percent:number) {
      this.dateString = dateString;
      this.percent= percent;
    }
  }

  export default function OxygenSaturationScreen({route}:{route:any}) {
    interface Data {
      type: string;
      patient: any;
      datetime: string;
      percent: number,
    }
    const { id, password } = route.params;
  
    const [data, setData] = useState<OxygenData[]>([new OxygenData("", 0)]);
    const [oxygenSaturation, setOxygenSaturation] = useState<Data[]>([]);

    function getOxygenSaturation() {
      if (Platform.OS === 'android') {
        var today = new Date();
        const opt = {
          startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
          endDate: today.toISOString(),
          bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
          bucketInterval: 1, // optional - default 1.
          ascending: true, // optional; default false
        };
        GoogleFit. getOxygenSaturationSamples(opt).then(res => {
          const output = res.map(item => {
            const date = moment(item.endDate);
            return {
              type:"oxygen saturation",
              patient:id,
              datetime:date.format('MMM DD, YYYY hh:mm:ss'),
              percent:item.value
            }
          });
          setOxygenSaturation(output);
          //console.log("output:"+JSON.stringify(res));
          console.log("blood pressure:"+JSON.stringify(oxygenSaturation));
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
            Scopes.FITNESS_OXYGEN_SATURATION_READ,
          ]
        };
        GoogleFit.checkIsAuthorized().then(() => {
          var authorized = GoogleFit.isAuthorized;
          console.log("Status: "+authorized);
          if (authorized) {
            getOxygenSaturation();
          } else {
            // Authentication if already not authorized for a particular device
            GoogleFit.authorize(options)
              .then(authResult => {
                if (authResult.success) {
                  console.log('AUTH_SUCCESS');
                  // if successfully authorized, fetch data
                  getOxygenSaturation();
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
          getOxygenSaturation();
        });
      }
    }
  
    useEffect(() => {
      fetchPatientData(id,password,OxygenData,setData,"oxygen saturation",["percent"]);
      init();
    }, []);
  
    return (
      <React.Fragment key={"oxygen saturation"}>
        {PageHeader()}
        {SingleValueChart(
          data.map((datum) => {
            return({
              value: datum.percent,
              date: datum.dateString
            });
          })
        )}
        {DataList(
          data.map((datum, index) => {
            return(
              <ListItem
                key = {index}
                title = {`${datum.percent} %  `}
                secondaryText = {datum.dateString}
              />
            );
          })
        )}
      </React.Fragment>
    );
  }