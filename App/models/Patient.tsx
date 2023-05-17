/*
This file contains the Patient class, which represents a patient object with properties such as first name, last name, email, etc. 
It is used to store and manage patient-related information within the application.
It also has methods for getting and setting these properties, as well as for managing the patient's emergency contact information.
*/

// Importing the react-native-config library to access environment variables in the application.
import Config from "react-native-config";
// Importing the UserManager class to manage user-related operations.
import UserManager from "../managers/UserManager";

// Defining the Patient class which will represent a patient object in the application.
export default class Patient {

  // Defining the private properties for the Patient class. These properties store information about the patient's personal details, emergency contact, and normal measurement ranges.
  private id:string;
  private firstName:string = "";
  private lastName:string = "";
  private phone:string = "";
  private birthDate:string = "";
  private emergencyContactPhone:string = "";
  private emergencyContactName:string = "";
  private primaryPhysicianId:string = "";
  private generalNote:string = "";
  private normalPulseRange:any;
  private normalWeightRange:any;
  private normalSystolicBloodPressureRange:any;
  private normalDiastolicBloodPressureRange:any;
  private normalTemperatureRange:any;
  private normalBloodOxygenPercentageRange:any;

  // Defining the constructor for the Patient class. It takes the patient's ID as a parameter.
  public constructor(id:string) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public getFirstName() {
    return this.firstName;
  }

  public getLastName() {
    return this.lastName;
  }

  public getPhoneNumber() {
    return this.phone;
  }

  public getBirthDate() {
    return this.birthDate;
  }

  public getEmergencyContactName() {
    return this.emergencyContactName;
  }

  public getEmergencyContactPhoneNumber() {
    return this.emergencyContactPhone;
  }

  public getPrimaryPhysicianId() {
    return this.primaryPhysicianId;
  }

  public getGeneralNote() {
    return this.generalNote;
  }

  public getNormalPulseRange() {
    return this.normalPulseRange;
  }

  public getNormalWeightRange() {
    return this.normalWeightRange;
  }

  public getNormalSystolicBloodPressureRange() {
    return this.normalSystolicBloodPressureRange;
  }

  public getNormalDiastolicBloodPressureRange() {
    return this.normalDiastolicBloodPressureRange;
  }

  public getNormalTemperatureRange() {
    return this.normalTemperatureRange;
  }

  public getNormalBloodOxygenPercentageRange() {
    return this.normalBloodOxygenPercentageRange;
  }

  // Backend
  public async fetchNewData():Promise<boolean> {
    var headers = new Headers();
    headers.append("Authorization", UserManager.getInstance().getEncodedAuthorization());
    var requestOptions = {
      method: 'POST',
      headers: headers,
      redirect: 'follow'
    };
    const url = `${Config.GET_PATIENT_PROFILE_DATA_URL}?code=${Config.GET_PATIENT_PROFILE_DATA_FUNCTION_KEY}`
      + `&patient=${this.id}`;

    console.log("*********************************************");
    console.log("CALLING GetPatientProfileData AZURE FUNCTION");
    console.log("*********************************************");

    return fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .then((patientInfo) => {
      this.updateData(patientInfo);
      return true;
    })
    .catch(error => {
      console.log('error', error);
      return false;
    });
  }

  private updateData(patientInfo:any) {
    this.firstName = patientInfo["first_name"];
    this.lastName = patientInfo["last_name"];
    this.phone = patientInfo["phone"];
    this.birthDate = patientInfo["birth_date"];
    this.emergencyContactName = patientInfo["ec_name"];
    this.emergencyContactPhone = patientInfo["ec_phone"];
    this.primaryPhysicianId = patientInfo["primary_physician"];
    this.generalNote = patientInfo["general_note"];
    const measurementRanges = patientInfo["normal_ranges"];
    this.normalPulseRange = measurementRanges["pulse"];
    this.normalWeightRange = measurementRanges["weight"];
    this.normalSystolicBloodPressureRange = measurementRanges["blood_pressure"]["systolic"];
    this.normalDiastolicBloodPressureRange = measurementRanges["blood_pressure"]["diastolic"];
    this.normalTemperatureRange = measurementRanges["temperature"];
    this.normalBloodOxygenPercentageRange = measurementRanges["oxygen"];
  }
}