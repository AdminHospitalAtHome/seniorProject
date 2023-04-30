import Patient from "../models/Patient";

export default class UserManager {

  private static instance: UserManager;

  private id:string = "";
  private password:string = "";
  private firstName:string = "";
  private lastName:string = "";
  private phoneNumber:string = "";
  private currentPatient:Patient | undefined;
  private streamToken:string = "";

  static getInstance() {
    if (UserManager.instance == null) {
      UserManager.instance = new UserManager();
    }
    return this.instance;
  }

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

  setPatient(patientId:string) {
    this.currentPatient = new Patient(patientId);
  }

  clearPatient() {
    this.currentPatient = undefined;
  }

  getPatient():Patient | undefined {
    return this.currentPatient;
  }

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

  getStreamToken() {
    return this.streamToken;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }
}