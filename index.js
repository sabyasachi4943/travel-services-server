const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hiw3ljn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("travel-services")
      .collection("services");
    const reviewCollection = client.db("travel-services").collection("reviews");
    const ordersCollection = client.db("travel-services").collection("orders");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // reviews api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get user specific reviews
    app.get("/reviews", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/service-review", async (req, res) => {
      let query = {};
      if (req.query.service) {
        query = {
          service: req.query.service,
        };
      }
      const options = {
        sort:{
          "createdAt": -1
        }
    };
      const cursor = reviewCollection.find(query, options);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // orders api
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });

    app.get('/orders', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        }
      }
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    })



  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("travel services server is running");
});

app.listen(port, () => {
  console.log(`travel services server running on ${port}`);
});
