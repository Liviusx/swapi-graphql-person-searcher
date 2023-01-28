import { ApolloServer } from '@apollo/server';
import { Swapi } from '../datasources/swapi.js';

const swapi = new Swapi();

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
        getPersonByName: (root, { name }, context ) => {
            return swapi.getPersonByName(name);
        },
    },
    Person: {
        birthYear: (person) => person.birth_year,
        hairColor: (person) => person.hair_color,
        vehicles: (person, _, context) => {
            return swapi.loadFromUrlList(person.vehicles);
        },
        films: (person, __, context) => {
            return swapi.loadFromUrlList(person.films);
        }
    }
};

it(`searching “Darth Maul”, the films listed should be 
   “The Phantom Menace” and the vehicle model should be 
   “FC-20 speeder bike” `, async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    const response = await server.executeOperation({
        query: `query ExampleQuery($name: String) {
            getPersonByName(name: $name) {
            films {
                title
            }
            name
            vehicles {
                model
            }
            }
        }`,
        variables: { name: "Darth Maul" }
    });

    expect(response.body.singleResult.data.getPersonByName[0].name).toBe(`Darth Maul`);
    expect(response.body.singleResult.data.getPersonByName[0].films[0].title).toBe("The Phantom Menace");
    expect(response.body.singleResult.data.getPersonByName[0].vehicles[0].model).toBe("FC-20 speeder bike");
});
