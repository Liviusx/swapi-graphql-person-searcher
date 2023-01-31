import { createApolloServer } from "../createApolloServer.js";
import {jest} from '@jest/globals';

// Increasing timeout because at times
// I've observed significant increase in response times
jest.setTimeout(15000);

describe('SearchCharacterByName',  () => {
    it(`searching “Darth Maul”, the films listed should be 
    “The Phantom Menace” and the vehicle model should be 
    “FC-20 speeder bike” `, async () => {

   
        const testServer = await createApolloServer();

        const query = `query ExampleQuery($name: String) {
            searchPerson(name: $name) {
            films {
                title
            }
            name
            vehicles {
                model
            }
            }
        }`;

        const variables = { name: "Darth Maul" };

        const expectedData = {
            searchPerson: [
                {
                    name: 'Darth Maul',
                    films: [{ title: 'The Phantom Menace' }],
                    vehicles: [{ model: 'FC-20 speeder bike' }],
                },
            ],
        };

        const response = await testServer.executeOperation({
            query: query,
            variables: variables
        });

        const data = response.body.singleResult.data
        expect(data).toEqual(expectedData);
    });
});
