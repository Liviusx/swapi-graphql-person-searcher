import { ApolloServer } from '@apollo/server';
import { Swapi } from './datasources/swapi.js';

export const createApolloServer = () => {
    const swapi = new Swapi();

    const typeDefs = `#graphql
    type Film {
        title: String,
        characters: [Person]
    }

    type Vehicle {
        name: String,
        model: String,
        vehicle_class: String,
        manufacturer: String
    }

    type Person {
        name: String,
        films: [Film]
        vehicles: [Vehicle],
        url: String
    }

    type Query {
        searchPerson(name: String): [Person],
    }
`;
    const resolvers = {
        Query: {
            searchPerson: async (root, { name }, { dataSources }) => {
                return swapi.getPersonByName(name);
            }
        },
        Person: {
            vehicles: (person, _, context) => {
                return swapi.loadChildren(person.vehicles);
            },
            films: (person, __, context) => {
                return swapi.loadChildren(person.films);
            }
        }
    };

    return new ApolloServer({
        typeDefs,
        resolvers
    })
}