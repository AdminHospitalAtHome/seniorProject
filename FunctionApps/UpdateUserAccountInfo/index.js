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

  // Valid User: Update account info
  const patch = [];
  if (req.query.first) {
    patch.push({"op": "add", "path":"/first_name", "value": req.query.first});
  }
  if (req.query.last) {
    patch.push({"op": "add", "path":"/last_name", "value": req.query.last});
  }
  if (req.query.phone) {
    patch.push({"op": "add", "path":"/phone", "value": req.query.phone});
  }
  if (req.query.dob) {
    patch.push({"op": "add", "path":"/birth_date", "value": req.query.dob});
  }
  if (req.query.sex) {
    patch.push({"op": "add", "path":"/sex", "value": req.query.sex});
  }
  if (req.query.ecPhone) {
    patch.push({"op": "add", "path":"/ec_phone", "value": req.query.ecPhone});
  }
  if (req.query.ecName) {
    patch.push({"op": "add", "path":"/ec_name", "value": req.query.ecName});
  }
  if (patch.length > 0) {
    user.patch(patch);
  }
}