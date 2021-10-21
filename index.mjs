import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";
import bookReviewSchema from "./schemas/BookReview.json";
import dotenv from "dotenv";
dotenv.config();

(async function () {
  try {
    const key = fromString(process.env.DID_KEY, "base16");
    const did = new DID({
      provider: new Ed25519Provider(key),
      resolver: getResolver(),
    });
    await did.authenticate();

    const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
    ceramic.did = did;

    // Create a manager for the model
    const manager = new ModelManager(ceramic);

    const bookReviewSchemaID = await manager.createSchema("BookReview", {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "BookReview",
      type: "object",
      properties: bookReviewSchema,
      required: ["title", "author", "rating", "review"],
      additionalProperties: false,
    });

    await manager.createDefinition("bookReview", {
      name: "Book Review",
      description: "A simple book review.",
      schema: manager.getSchemaURL(bookReviewSchemaID),
    });

    await manager.createTile(
      "exampleBookReview",
      {
        title: "1984",
        author: "George Orwell",
        rating: 5,
        review:
          "	This classic novel serves as a poignant reminder of the potential dystopian future that is not outside the realm of possibly. Ceramic is here to help!",
      },
      { schema: manager.getSchemaURL(bookReviewSchemaID) }
    );

    const model = await manager.toPublished();

    return await writeFile("./model.json", JSON.stringify(model));
  } catch (error) {
    console.log(error);
  }
})();
