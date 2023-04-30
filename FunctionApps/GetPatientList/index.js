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

  if (pw != reqPw || readDoc.is_patient) {
    context.res.status = 403;
    return;
  }

  // Valid Provider: Query for active patients
  const query = {
    'query': 'SELECT u.first_name, u.last_name, u.phone, u.id ' +
              'FROM Users u ' +
              'WHERE u.is_patient',
    'parameters': []
  };
  const feedResponse = await users.items.query(query).fetchAll();
  const patientDocs = feedResponse.resources;

  patientDocs.sort((patient1, patient2) => (patient1.last_name > patient2.last_name) ? 1 : -1);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: patientDocs
  };
}