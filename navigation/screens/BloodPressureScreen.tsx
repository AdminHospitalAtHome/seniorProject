import React, { useState, useEffect, Component } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config'
import { ListItem } from '@react-native-material/core';

class BloodpressureData {
  dateString:string;
  systolic:number;
  diastolic:number;
  constructor(dateString:string, systolic:number, diastolic:number) {
    this.dateString = dateString;
    this.systolic = systolic;
    this.diastolic = diastolic;
  }
}

export default function BloodPressureScreen({route}:{route:any}) {
  const { id, password } = route.params;

  const [data, setData] = useState<BloodpressureData[]>([new BloodpressureData("", 0,0)]);
  const options = {
    scopes: [
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
    ]
  };

  useEffect(() => {
    // async function fetchPatientData() {
    //   /* TODO: Abstract out */
    //   const Buffer = require("buffer").Buffer;
    //   let encodedAuth = new Buffer(id + ":" + password).toString("base64");

    //   var myHeaders = new Headers();
    //   myHeaders.append("Authorization", `Basic ${encodedAuth}`);

    //   var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     redirect: 'follow'
    //   };
    //   console.log("*********************************************");
    //   console.log("CALLING GetPatientMeasurements AZURE FUNCTION");
    //   console.log("*********************************************");

    //   /* ------------------ */
    //   const url = `https://hospital-at-home-app.azurewebsites.net/api/GetPatientMeasurements?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=blood pressure`;
    //   fetch(url, requestOptions)
    //     .then(response => response.text())
    //     .then(result => JSON.parse(result).feed)
    //     .then(arr => {
    //       const fetched = [];
    //       for (var obj of arr) {
    //         fetched.push(new BloodpressureData(obj.datetime, obj.systolic,obj.diastolic));
    //       }
    //       setData(fetched);
    //     })
    //     .catch(error => console.log('error', error));
    // }
    fetchPatientData(id, password, BloodpressureData, setData, "blood pressure", ["systolic", "diastolic"]);
  }, []);

  return (
    <React.Fragment key={"blood pressure"}>
      {PageHeader()}
      {DoubleValueChart(
        data.map((datum) => {
          return({
            first_value: datum.systolic,
            second_value: datum.diastolic,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return(
            <ListItem 
              key = {index}
              title = {`${datum.systolic} mmHg       ${datum.diastolic} mmHg`}
              secondaryText = {datum.dateString}
            />
          );
        })
      )}
    </React.Fragment>
  );
}