import {
  Platform,
} from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { DataList, PageHeader, SingleValueChart, fetchPatientData } from '../../components/MeasurementPageComponents';
import { ListItem } from '@react-native-material/core';

class PulseData {
  dateString:string;
  bpm:number;
  constructor(dateString:string, bpm:number) {
    this.dateString = dateString;
    this.bpm = bpm;
  }
}

export default function PulseScreen({route}:{route:any}) {
  const { id, password } = route.params;
  const [data, setData] = useState<PulseData[]>([new PulseData("", 0)]);
  useEffect(() => {
    fetchPatientData(id, password, PulseData, setData, "pulse", ["bpm"]);
  }, []);
return (
    <React.Fragment key={"pulse"}>
      {PageHeader()}
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
              secondaryText = {datum.dateString}
            />
          );
        })
      )}
    </React.Fragment>
  );
}
