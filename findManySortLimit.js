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

    console.log('Retrieving recipes ...');
    const recipes = await collection.find().sort(['title', 1]).limit(3);

    // recipes is now a cursor
    while (await recipes.hasNext()) {
      const recipe = await recipes.next();
      console.dir(recipe.title);
    }
  } catch (error) {
    console.log(`Error: ${error.stack}`);
  }

  await client.close();
})();
