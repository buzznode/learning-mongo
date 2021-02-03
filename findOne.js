const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const db = 'cooker';

(async function () {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    console.log('Getting connection ...');
    await client.connect();
    const database = client.db(db);
    const collection = database.collection('recipes');

    console.log('Retrieving recipe ...');
    const recipe = await collection.findOne();
    console.log(recipe);
  } catch (error) {
    console.log(`Error: ${error.stack}`);
  }

  await client.close();
})();
