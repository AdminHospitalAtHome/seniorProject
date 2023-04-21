const { CosmosClient } = require("@azure/cosmos")

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

  users.items.create(
    {
      "id":userEmail,
      "first_name":req.query.first,
      "last_name":req.query.last,
      "phone":req.query.phone,
      "password":btoa(req.query.password),
      "is_patient":true,
      "birth_date":req.query.dob,
      "ec_phone":(req.query.ecPhone ? req.query.ecPhone : "None"),
      "ec_name":(req.query.ecName ? req.query.ecName : "None")
    }
  );
}