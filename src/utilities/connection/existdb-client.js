// This module defines the ExistDBClient class, which provides methods to interact with an eXist-db database.
// It includes methods to list collections, fetch files, and write files to the database using the provided configuration.

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