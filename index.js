const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// connect application
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx2ul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('db connected');

    const database = client.db('observe-db');
    const watchesCollection = database.collection('watchesCollection');
    const ordersCollection = database.collection('orders');
    const reviewCollection = database.collection('review');
    // get data from database
    app.get('/watches', async (req, res) => {
      const cursor = watchesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get data
    app.get('/myOrders', async (req, res) => {
      console.log('hello');
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
      console.log(result);
    });

    // post data
    app.post('/watches', async (req, res) => {
      const placeOrder = req.body;
      const result = await ordersCollection.insertOne(placeOrder);
      res.json(result);
      console.log(result);
    });
    // post review
    app.post('/review', async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Doctors Portal Server');
});

app.listen(port, () => {
  console.log(`Example app listening at   http://localhost:${port}`);
});
