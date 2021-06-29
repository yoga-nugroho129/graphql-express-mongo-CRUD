const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

mongoose
  .connect(process.env.DB_CONNECTION,  { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to Database!'))
  .catch(error => console.log(error))

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(5000, () => console.log('Listen to port 5000...'))