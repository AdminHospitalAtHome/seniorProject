const { CosmosClient } = require("@azure/cosmos")

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const client = new CosmosClient(process.env["DB_PRIMARY_CONNECTION_STRING"]);
  const { database } =  await client.databases.createIfNotExists({ id: "HospitalAtHomeDB" });

  // Verify Authorization
  const authReq = req.headers.authorization.split(" ");
  if (authReq[0] != "Basic") {
    context.res.status = 403;
    return;
  }
  const decAuth = atob(authReq[1]);
  const reqCred = decAuth.split(":");
  const reqEmail = reqCred[0]
  const reqPw = reqCred[1];

  const { container: users } = await database.containers.createIfNotExists({ id: "Users" });
  const user = users.item(reqEmail, reqEmail);
  const { resource: readDoc } = await user.read();

  if (!readDoc) {
    context.res.status = 403;
    return;
  }

  const pw = atob(readDoc.password);

  if (pw != reqPw) {
    context.res.status = 403;
    return;
  }

  // Valid User: Ensure proper authorization to view data
  if (reqEmail != req.query.patient && readDoc.is_patient) {
    context.res.status = 403;
    return;
  }

  // Authorized request
  const { container: measurements } = await database.containers.createIfNotExists({ id: "Measurements" });
  
  const functionResponse = await measurements.scripts.storedProcedure("getPatientMeasurementsByType")
    .execute(req.query.type, req.query.patient);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: functionResponse.resource
  };
}