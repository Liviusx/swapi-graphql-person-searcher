import { ApolloServer } from '@apollo/server';
import { Swapi } from './datasources/swapi.js';

export const createApolloServer = async () => {
    const swapi = new Swapi();

    const typeDefs = `#graphql
    type Film {
        title: String,
    }

    type Vehicle {
        name: String,
        model: String,
    }

    type Person {
        name: String,
        films: [Film!]
        vehicles: [Vehicle!],
    }

    type Query {
        searchPerson(name: String): [Person],
    }
`;
    const resolvers = {
        Query: {
            searchPerson: async (root, { name }, { dataSources }) => {
                const data = await swapi.getPersonByName(name);
                return data.results;
            }
        },
        Person: {
            vehicles: async (person, _, context) => {
                return await swapi.loadChildren(person.vehicles);
            },
            films: async (person, __, context) => {
                return await swapi.loadChildren(person.films);
            }
        }
    };

    return new ApolloServer({
        typeDefs,
        resolvers
    })
}