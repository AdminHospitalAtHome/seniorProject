import React, { useState, useEffect, Component } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config'
import { ListItem } from '@react-native-material/core';

class TemperatureData {
    dateString:string;
    degree:number;
    constructor(dateString:string, degree:number) {
      this.dateString = dateString;
      this.degree= degree;
    }
  }

  export default function TemperatureScreen({route}:{route:any}) {
    const { id, password } = route.params;
  
    const [data, setData] = useState<TemperatureData[]>([new TemperatureData("", 0)]);
    const options = {
      scopes: [
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ]
    };
  
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
        const url = `https://hospital-at-home-app.azurewebsites.net/api/GetPatientMeasurements?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=temperature`;
        fetch(url, requestOptions)
          .then(response => response.text())
          .then(result => JSON.parse(result).feed)
          .then(arr => {
            const fetched = [];
            for (var obj of arr) {
              fetched.push(new TemperatureData(obj.datetime, obj.degree));
            }
            setData(fetched);
          })
          .catch(error => console.log('error', error));
      }
      fetchPatientData();
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
          data.map((datum) => {
            return(
              <ListItem
                title = {`${datum.degree} ${'\u00b0'}F  `}
                secondaryText = {datum.dateString}
              />
            );
          })
        )}
      </React.Fragment>
    );
  }