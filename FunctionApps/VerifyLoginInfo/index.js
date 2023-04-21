const { CosmosClient } = require("@azure/cosmos");
//const StreamChat = require('stream-chat').StreamChat;

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
  const decAuth = Buffer.from(authReq[1], 'base64').toString();
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

  const pw = Buffer.from(readDoc.password, 'base64').toString();

  if (pw != reqPw) {
    context.res.status = 403;
    return;
  }

  // Valid User -> Handle Get Stream Chat Authentication
  // const serverClient = StreamChat.getInstance(process.env["GETSTREAM_API_KEY"], process.env["GETSTREAM_SECRET"]);
  // const streamResponse = await serverClient.upsertUser({
  //   id: readDoc.id,
  //   role: 'user',
  //   name: `${readDoc.first_name} ${readDoc.last_name}`,
  //   online: true
  // });

  //const token = serverClient.createToken(readDoc.id);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      first_name: readDoc.first_name,
      last_name: readDoc.last_name,
      is_patient: readDoc.is_patient,
      phone: readDoc.phone
      //stream_token: token
    }
  };
}