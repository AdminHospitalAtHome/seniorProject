import React, { useState, useEffect, Component } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import Config from 'react-native-config'
import { ListItem } from '@react-native-material/core';

class OxygenData {
    dateString:string;
    percent:number;
    constructor(dateString:string, percent:number) {
      this.dateString = dateString;
      this.percent= percent;
    }
  }

  export default function OxygenSaturationScreen({route}:{route:any}) {
    const { id, password } = route.params;
  
    const [data, setData] = useState<OxygenData[]>([new OxygenData("", 0)]);
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
      //   const url = `https://hospital-at-home-app.azurewebsites.net/api/GetPatientMeasurements?code=${Config.GET_PATIENT_MEASUREMENTS_FUNCTION_KEY}&type=oxygenSaturation`;
      //   fetch(url, requestOptions)
      //     .then(response => response.text())
      //     .then(result => JSON.parse(result).feed)
      //     .then(arr => {
      //       const fetched = [];
      //       for (var obj of arr) {
      //         fetched.push(new OxygenData(obj.datetime, obj.percent));
      //       }
      //       setData(fetched);
      //     })
      //     .catch(error => console.log('error', error));
      // }
      fetchPatientData(id,password,OxygenData,setData,"oxygen saturation",["percent"]);
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