import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";
import dotenv from "dotenv";
dotenv.config();

async function getBookReviewSchemaID() {
  try {
    const key = fromString(process.env.DID_KEY, "base16");
    // Create and authenticate the DID
    const did = new DID({
      provider: new Ed25519Provider(key),
      resolver: getResolver(),
    });
    await did.authenticate();

    // Connect to the local Ceramic node
    const ceramic = new CeramicClient("http://localhost:7007");
    ceramic.did = did;

    // Create a manager for the model
    const manager = new ModelManager(ceramic);

    const bookReviewSchemaID = await manager.createSchema("BookReview", {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "BookReview",
      type: "object",
      properties: {
        title: {
          "type": "string",
          "maxLength": 500,
        },
        rating: {
          "type": "integer",
          "min": 1,
          "max": 5,
        },
        description: {
          "type": "string",
          "maxLength": 500,
        },
      },
    });

    return bookReviewSchemaID;
  } catch (error) {
    console.log(error);
  }
}

getBookReviewSchemaID();
