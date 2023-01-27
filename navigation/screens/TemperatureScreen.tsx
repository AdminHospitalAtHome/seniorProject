import React, { useState, useEffect, Component } from 'react';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { DataList, PageHeader, SingleValueChart, DoubleValueChart,fetchPatientData } from '../../components/MeasurementPageComponents';
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
      fetchPatientData(id,password,TemperatureData,setData, "temperature", ["degree"]);
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