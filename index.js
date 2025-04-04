require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// name 
// pass C3jmAc18jzVViH4g


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rupon:W29vXJcTeblhGP2q@cluster0.ycnw9n2.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db("watch-wwe");
        const videoCollection = database.collection("videos")


        app.post('/upload', async (req, res) => {
            const video = req.body;
            const result = await videoCollection.insertOne(video);
            res.send(result);
        })

        app.get('/videos', async (req, res) => {
            const cursor = videoCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/video/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await videoCollection.findOne(query);
            res.send(result);
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('WWE IS RUNNING')
})
app.listen(port, () => {
    console.log(`server is running on ${port}`);

})