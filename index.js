require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
const corsOption = ['http://localhost:5173',
    'https://watch-wwe-online.web.app',
    'https://watch-wwe-online-server-4v8reoj2i-rupongomezs-projects.vercel.app'];
app.use(cors(corsOption))
app.use(express.json());

// name 
// pass C3jmAc18jzVViH4g


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycnw9n2.mongodb.net/?appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db("watch-wwe");
        const videoCollection = database.collection("videos")


        app.post('/upload', async (req, res) => {
            const video = req.body;
            const result = await videoCollection.insertOne(video);
            res.send(result);
        })

        app.get('/videos', async (req, res) => {
            const cursor = videoCollection.find().sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/video/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await videoCollection.findOne(query);
            res.send(result);
        })

        // Sorting by Category and date
        app.get('/raw', async (req, res) => {
            const cursor = videoCollection.find({ category: "Raw" }).sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/SmackDown', async (req, res) => {
            const cursor = videoCollection.find({ category: "SmackDown" }).sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/PPV', async (req, res) => {
            const cursor = videoCollection.find({ category: "PPV" }).sort({ date: -1 });
            const result = await cursor.toArray();
            res.send(result)
        })

        // Manage videso

        app.delete('/video/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await videoCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/video/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedVideo = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedVideo.title,
                    description: updatedVideo.description,
                    category: updatedVideo.category,
                    date: updatedVideo.date,
                    thumbnail: updatedVideo.thumbnail,
                    video: updatedVideo.video,
                    size: updatedVideo.size,
                },
            };
            const result = await videoCollection.updateOne(query, updateDoc, options);
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
    // console.log(`server is running on ${port}`);

})