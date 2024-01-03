const { MongoClient } = require("mongodb");
const fs = require("fs");

async function importData() {
  // Connection URI. Update it with your MongoDB connection string.
  const uri = "mongodb://localhost:27017/Skystreaming";

  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Specify the path to your JSON or CSV file
    const filePath = "path/to/your/data.json";
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Specify the target collection name
    const collectionName = "your-collection-name";

    // Get the database and collection
    const database = client.db();
    const collection = database.collection(collectionName);

    // Insert the data into the collection
    await collection.insertMany(jsonData);

    console.log("Data imported successfully");
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the importData function
importData();
