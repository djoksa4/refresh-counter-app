const express = require("express");
const { MongoClient } = require("mongodb");
const ejs = require("ejs");

const app = express();
const url = "mongodb://admin:password@my-db:27017"; // Assuming "my-db" is the Docker network alias for the MongoDB container

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url);
    const db = client.db("testdb"); // Replace 'testdb' with your database name
    const collection = db.collection("refreshes"); // Replace 'refreshes' with your collection name

    // Check if collection exists, create it if not
    const collectionExists = await db
      .listCollections({ name: "refreshes" })
      .hasNext();
    if (!collectionExists) {
      await db.createCollection("refreshes");
      await collection.insertOne({ count: 0 });
    }

    // Increment refresh count
    await collection.updateOne({}, { $inc: { count: 1 } });

    // Retrieve refresh count
    const result = await collection.findOne({});
    const refreshCount = result.count;

    // Render the EJS template
    res.render("index", { refreshCount });

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
