import React, { useState, useEffect, Component } from 'react';
//import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config';
import { ListItem } from '@react-native-material/core';

class WeightData {
  dateString:string;
  lbs:number;
  constructor(dateString:string, lbs:number) {
    this.dateString = dateString;
    this.lbs = lbs;
  }
}

export default function WeightScreen({route}:{route:any}) {
  const { id, password } = route.params;

  const [data, setData] = useState<WeightData[]>([]);
  // const options = {
  //   scopes: [
  //     Scopes.FITNESS_BODY_READ,
  //     Scopes.FITNESS_BODY_WRITE,
  //   ]
  // };

  useEffect(() => {
    async function fetchPatientData() {
      /* TODO: Abstract out */
      const Buffer = require("buffer").Buffer;
      let encodedAuth = new Buffer(id + ":" + password).toString("base64");
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${encodedAuth}`);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };
      console.log("*********************************************");
      console.log("CALLING GetPatientMeasurements AZURE FUNCTION");
      console.log("*********************************************");

      /* ------------------ */
      const url = `${Config.GET_PATIENT_MEASUREMENTS_URL}?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=weight`;
      fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result).feed)
        .then(arr => {
          const fetched = [];
          for (var obj of arr) {
            fetched.push(new WeightData(obj.datetime, obj.lbs));
          }
          setData(fetched);
        })
        .catch(error => console.log('error', error));
    }
    fetchPatientData();
  }, []);

  return (
    <React.Fragment key={"weight"}>
      {PageHeader()}
      {SingleValueChart(
        data.map((datum) => {
          return({
            value: datum.lbs,
            date: datum.dateString
          });
        })
      )}
      {DataList(
        data.map((datum, index) => {
          return(
            <ListItem
              key={index}
              title = {`${datum.lbs} lbs`}
              secondaryText = {datum.dateString}
            />
          );
        })
      )}
    </React.Fragment>
  );
}
