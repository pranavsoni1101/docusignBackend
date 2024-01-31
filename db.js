const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.DB_URI);

const connectDb = async () => {
    try{
        await client.connect();
        console.log("Connected to MongoDb");
    }
    catch(error){
        console.log("Error establishing connection: ", error);
    }
}

module.exports = connectDb;