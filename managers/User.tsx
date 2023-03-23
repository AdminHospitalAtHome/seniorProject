export default class User {

  private static instance: User;

  private id = "";
  private password = "";
  private selectedPatient = "";
  private streamToken = "";
  private isPatient = true;

  static getInstance() {
    if (User.instance == null) {
      User.instance = new User();
    }

    return this.instance;
  }

  setCredentials(
    {id, password, streamToken, isPatient}:
    {id:string, password:string, streamToken:string, isPatient:boolean}
    ) {
    this.id = id;
    this.password = password;
    this.streamToken = streamToken;
    this.isPatient = isPatient;
    this.selectedPatient = id;
  }

  selectPatient(patientId:string) {
    this.selectedPatient = patientId;
  }

  getId() {
    return this.id;
  }

  getEncodedAuthorization() {
    return Buffer.from(this.id + ":" + this.password, "base64");
  }

  getStreamToken() {
    return this.streamToken;
  }
}