import { Platform } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart,fetchPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import moment from 'moment';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';

class TemperatureData {
    dateString:string;
    degree:number;
    constructor(dateString:string, degree:number) {
      this.dateString = dateString;
      this.degree= degree;
    }
  }

  export default function TemperatureScreen({route}:{route:any}) {
    interface Data {
      type: string;
      patient: any;
      datetime: string;
      degree: number,
    }
    const { id, password } = route.params;
  
    const [data, setData] = useState<TemperatureData[]>([new TemperatureData("", 0)]);
    const [temperature, setTemperature] = useState<Data[]>([]);
    
    function getTemperature() {
      if (Platform.OS === 'android') {
        var today = new Date();
        const opt = {
          startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
          endDate: today.toISOString(),
          bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
          bucketInterval: 1, // optional - default 1.
          ascending: true, // optional; default false
        };
        GoogleFit.getBodyTemperatureSamples(opt).then(res => {
          const output = res.map(item => {
            const date = moment(item.endDate);
            return {
              type:"temperature",
              patient:id,
              datetime:item.endDate,
              degree:item.value
            }
          });
          setTemperature(output);
          //console.log("output:"+JSON.stringify(res));
          console.log("blood pressure:"+JSON.stringify(temperature));
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
            Scopes.FITNESS_BODY_TEMPERATURE_READ,
          ]
        };
        GoogleFit.checkIsAuthorized().then(() => {
          var authorized = GoogleFit.isAuthorized;
          console.log("Status: "+authorized);
          if (authorized) {
            getTemperature();
          } else {
            // Authentication if already not authorized for a particular device
            GoogleFit.authorize(options)
              .then(authResult => {
                if (authResult.success) {
                  console.log('AUTH_SUCCESS');
                  // if successfully authorized, fetch data
                  getTemperature();
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
          getTemperature();
        });
      }
    }
  
    useEffect(() => {
      init();
      fetchPatientData(id,password,TemperatureData,setData, "temperature", ["degree"]);
      init();
    }, []);
  
    return (
      <React.Fragment key={"temperature"}>
        {PageHeader()}
        {SingleValueChart(
          data.map((datum) => {
            return({
              value: datum.degree,
              date: datum.dateString
            });
          })
        )}
        {DataList(
          data.map((datum, index) => {
            return(
              <ListItem
                key = {index}
                title = {`${datum.degree} ${'\u00b0'}F  `}
                secondaryText = {datum.dateString}
              />
            );
          })
        )}
      </React.Fragment>
    );
  }