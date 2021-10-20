import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import readingListSchema from "./schemas/ReadingList.json";
import dotenv from "dotenv";
dotenv.config();

(async function () {
  try {
    const seed = new Uint8Array(32); //  32 bytes with high entropy
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: KeyResolver.getResolver() });
    await did.authenticate();

    const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
    ceramic.did = did;

    // Create a manager for the model
    const manager = new ModelManager(ceramic);

    const ReadingListSchemaID = await manager.createSchema("ReadingList", {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "ReadingList",
      type: "array",
      items: readingListSchema,
    });

    await manager.createDefinition("readingList", {
      name: "Reading List",
      description: "A list of ratings and reviews of all books read.",
      schema: manager.getSchemaURL(ReadingListSchemaID),
    });

    const model = await manager.toPublished();

    return await writeFile("./model.json", JSON.stringify(model));
  } catch (error) {
    console.log(error);
  }
})();
