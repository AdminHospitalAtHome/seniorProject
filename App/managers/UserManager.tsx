/*
This file contains the UserManager class, which is responsible for managing user-related data, state and actions throughout the application.
It is a singleton class, meaning that there is only one instance of UserManager that can be accessed throughout the application using the getInstance() method.
The UserManager class provides methods for getting and setting user information, managing the current patient, and handling authentication and user state.
It stores user credentials, handles singleton instance creation, and provides methods for logging in, setting patient data, and accessing user information.
*/

// Importing the Patient class from the models directory
import Patient from "../models/Patient";

// UserManager class declaration (singleton pattern)
export default class UserManager {

  // Initialize the instance as null
  private static instance: UserManager;

  // Defining the user's attributes: id, password, first name, last name, phone number, stream token, and role (patient or healthcare provider)
  private id:string = "";
  private password:string = "";
  private firstName:string = "";
  private lastName:string = "";
  private phoneNumber:string = "";
  private currentPatient:Patient | undefined;
  private streamToken:string = "";

  // Defining the current selected patient
  static getInstance() {
    if (UserManager.instance == null) {
      // Defining a private constructor for the singleton pattern
      UserManager.instance = new UserManager();
    }
    return this.instance;
  }

  // setCredentials method to set the user's attributes (id, password, first name, last name, phone number, stream token, and role)
  setCredentials(
    {id, password, firstName, lastName, phoneNumber, streamToken, isPatient}:
    {id:string, 
     password:string, 
     firstName:string,
     lastName:string,
     phoneNumber:string,
     streamToken:string, 
     isPatient:boolean}
    ) {
    this.id = id;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.streamToken = streamToken;
    if (isPatient) {
      this.setPatient(id);
    }
  }

  // setPatient method to set the current selected patient by email
  setPatient(patientId:string) {
    this.currentPatient = new Patient(patientId);
  }

  // clearPatient method to clear the current selected patient information
  clearPatient() {
    this.currentPatient = undefined;
  }

  // getPatient method to get the current selected patient
  getPatient():Patient | undefined {
    return this.currentPatient;
  }

  // isPatient method to check if the user is a patient or not (returns true if the user is a patient, false otherwise)
  isPatient():boolean {
    return (this.currentPatient != undefined && this.currentPatient.getId() == this.id);
  }

  // Returns true if fetch from DB was successful
  async updatePatientData():Promise<boolean> {
    if (this.currentPatient == undefined) {
      return false;
    }
    return this.currentPatient.fetchNewData();
  }

  getId() {
    return this.id;
  }

  getEncodedAuthorization() {
    const Buffer = require("buffer").Buffer;
    return `Basic ${Buffer.from(this.id + ":" + this.password, "utf8").toString("base64")}`;
  }

  // getStreamToken method to get the user's stream token (used for chat functionality)
  getStreamToken() {
    return this.streamToken;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  // getPhoneNumber method to get the user's phone number
  getPhoneNumber() {
    return this.phoneNumber;
  }
}