import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Swapi } from './datasources/swapi.js';

const typeDefs = `#graphql

  type Film {
    title: String,
    characters: [Person!]
  }

  type Vehicle {
    name: String,
    model: String,
    vehicle_class: String,
    manufacturer: String
    pilots: [Person!],
    url: String
  }

  type Person {
    name: String,
    hairColor: String,
    birthYear: String,
    films: [Film!]
    vehicles: [Vehicle!],
    url: String
  }

  type Query {
    getPersonByName(name: String): [Person],
  }
`;

const resolvers = {
  Query: {
    getPersonByName: (root, { name }, { dataSources }) => {
      return dataSources.swapi.getPersonByName(name);
    },
  },

  // Made the names with _ consistent
  Person: {
    birthYear: (person) => person.birth_year,
    hairColor: (person) => person.hair_color,
    vehicles: (person, _, context) => { 
      return context.dataSources.swapi.loadFromUrlList(person.vehicles);
    },
    films: (person, __, context) => {
      return context.dataSources.swapi.loadFromUrlList(person.films);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
  context: async () => {
    return {
      dataSources: {
        swapi: new Swapi()
      },
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);