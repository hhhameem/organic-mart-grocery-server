const express = require("express");
const app = express();
var cors = require("cors");
const { MongoClient, CURSOR_FLAGS } = require("mongodb");
ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mol88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("organicMart");
    const productCollection = database.collection("product");
    const userCollection = database.collection("user");
    const orderCollection = database.collection("order");

    //get registered user data by their email
    app.get("/user", async (req, res) => {
      const email = req.query.email;
      query = { email };
      const result = await userCollection.findOne(query);
      res.json(result);
    });

    //save registered user data
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.json(result);
    });

    //fetch product
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.json(result);
    });

    //save product data
    app.post("/product", async (req, res) => {
      const productData = req.body;
      const result = await productCollection.insertOne(productData);
      res.json(result);
    });

    //order status update
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;

      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateStatus.status,
        },
      };
      const result = await bicycleOrdersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // DELETE ORDER
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await bicycleOrdersCollection.deleteOne(query);
      res.json(result);
    });

    //save order data
    app.post("/order", async (req, res) => {
      const orderData = req.body;
      const result = await orderCollection.insertOne(orderData);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
