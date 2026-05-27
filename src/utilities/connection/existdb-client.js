import { listCollection, fetchFile, writeFile } from "./existdb.js";

export class ExistDBClient {
  constructor(config) {
    this.config = config;
  }

  list() {
    return listCollection(
      this.config.baseUrl,
      this.config.collection,
      this.config.user,
      this.config.password,
      this.config.proxyUrl
    );
  }

async get(name) {
  return fetchFile(
    this.config.baseUrl,
    this.config.collection,
    name,
    this.config.user,
    this.config.password,
    this.config.proxyUrl
  );
}

  put(name, xml) {
    return writeFile(
      this.config.baseUrl,
      this.config.collection,
      name,
      xml,
      this.config.user,
      this.config.password,
      this.config.proxyUrl
    );
  }
}