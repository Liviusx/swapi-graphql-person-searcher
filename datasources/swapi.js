import { RESTDataSource } from "@apollo/datasource-rest";

export class Swapi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://swapi.dev/api/";
  }

  async getPersonByName(name) {
    const data = await this.get(`people/?search=${name}`);
    return data.results;
  }

  async loadFromUrlList(urls) {
    if (typeof urls === "undefined") {
      throw new Error('You must pass a valid array!');
    }

    const arrayOfResponses = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((res) => res.json())
      )
    );

    return arrayOfResponses;
  }
}