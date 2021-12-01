const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.801m1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("portfolio");
        const projectCollection = database.collection("projects");
        // Get all project data
        app.get("/projects", async (req, res) => {
            const projects = projectCollection.find({});
            const result = await projects.toArray();
            res.json(result);
        });

        // Get a single project data
        app.get("/projects/:id", async (req, res) => {
            console.log("API hit");
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const project = await projectCollection.findOne(query);
            res.json(project);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Portfolio Server is running");
});
app.listen(port, () => {
    console.log("Portfolio Server is running on:", port);
});
