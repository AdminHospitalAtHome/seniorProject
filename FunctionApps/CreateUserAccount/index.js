const { CosmosClient } = require("@azure/cosmos")
const StreamChat = require('stream-chat').StreamChat

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const client = new CosmosClient(process.env["DB_PRIMARY_CONNECTION_STRING"]);
  const { database } =  await client.databases.createIfNotExists({ id: "HospitalAtHomeDB" });
  const { container: users } = await database.containers.createIfNotExists({ id: "Users" });

  const userEmail = req.query.email;
  
  const {resource: user} = await users.item(userEmail, userEmail).read();

  if (!!user) {
    context.res.status = 403;
    return;
  }

  // Valid User -> Handle Get Stream Chat Authentication
  const serverClient = StreamChat.getInstance(process.env["GETSTREAM_API_KEY"], process.env["GETSTREAM_SECRET"]);
  const streamResponse = await serverClient.upsertUser({
    id: userEmail.replace(/[^a-zA-Z]+/g, ''),
    role: 'user',
    name: `${req.query.first} ${req.query.last}`
  });

  users.items.create(
    {
      "id":userEmail,
      "first_name":req.query.first,
      "last_name":req.query.last,
      "phone":req.query.phone,
      "password":Buffer.from(req.query.password).toString('base64'),
      "is_patient":true,
      "birth_date":req.query.dob,
      "ec_phone":(req.query.ecPhone ? req.query.ecPhone : "None"),
      "ec_name":(req.query.ecName ? req.query.ecName : "None")
    }
  );
}