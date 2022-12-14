const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const colors = require('colors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uuzniqz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('tourServices').collection('services')
        const orderCollection = client.db('tourServices').collection('orders')
        const userCollection = client.db('tourServices').collection('users')

        //JWT token
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        //orders api
        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

        //Delete Api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
        //user api
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.send(result)
        })

        //user get
        app.get('/users', async (req, res) => {
            let query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })
    }
    finally {

    }


}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('fashion photography is running')
})
app.listen(port, () => {
    console.log(`fashion photography running on the port number ${port}`);
})