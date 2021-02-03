const MongoClient = require('mongodb').MongoClient;
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('What would you like to cook today?: ', (search) => {
  recipe_search(search);
  readline.close();
});

const recipe_search = (search) => {
  const uri = 'mongodb://localhost:27017';
  const db = 'cooker';

  (async function () {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      console.log('Getting connection ...');
      await client.connect();
      const database = client.db(db);
      const collection = database.collection('recipes');
      const query = {
        title: {
          $regex: search,
          $options: 'i',
        },
      };

      const recipes = await collection.find(query).sort(['title', 1]);

      console.clear();
      console.log('--');
      console.log(`-- Searching for ... ${search}`);
      console.log('--');
      console.log();
      console.log('We found the following recipes:\n');

      // recipes is now a cursor
      while (await recipes.hasNext()) {
        const recipe = await recipes.next();
        display_recipe(recipe);
      }
    } catch (error) {
      console.log(`Error: ${error.stack}`);
    }

    await client.close();
  })();
};

const display_recipe = (recipe) => {
  const total_time = recipe['prep_time'] + recipe['cook_time'];
  console.table([
    {
      title: recipe.title,
      likes: recipe.likes_count,
      rating: recipe.rating_avg,
    },
  ]);
  console.log(`\nDESCRIPTION: ${recipe.desc}\n`);
  console.log(
    `This recipe will take about ${total_time} minutes to prepare and be ~${recipe.calories_per_serving} calories per serving.\n`
  );
};
