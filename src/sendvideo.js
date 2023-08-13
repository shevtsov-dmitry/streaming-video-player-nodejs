// CONNECT TO DB
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // Your GridFS operations will go here



    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

main().catch(console.error);
