const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const cors = require('cors')
const axios = require("axios");
cpnst path = require("path")
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const app = express();
//Allow cors 
app.use(cors());
//launch type

const LaunchType = new GraphQLObjectType({
  name: "Launch",

  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
});

//Rocket type

const RocketType = new GraphQLObjectType({
  name: "Rocket",

  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then((res) => res.data);
      },
    },
    rocket: {
      type: RocketType,
      args: {
        rocket_id: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return axios
          .get(`https://api.spacexdata.com/v3/rockets/${args.rocket_id}`)
          .then((res) => res.data);
      },
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve: () => {
        return axios
          .get("https://api.spacexdata.com/v3/rockets")
          .then((res) => res.data);
      },
    },
    launches: {
      type: new GraphQLList(LaunchType),
      resolve: () => {
        return axios
          .get("https://api.spacexdata.com/v3/launches")
          .then((res) => res.data);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.use(express.static('public'))

app.get('*',(req,res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER STARTED AT ${PORT}`));
