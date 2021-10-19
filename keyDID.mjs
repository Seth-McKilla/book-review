import { CeramicClient } from "@ceramicnetwork/http-client";
import KeyDidResolver from "key-did-resolver";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { randomBytes } from "@stablelib/random";

(async function () {
  const API_URL = "https://ceramic-clay.3boxlabs.com";
  const ceramic = new CeramicClient(API_URL);

  const resolver = {
    ...KeyDidResolver.getResolver(ceramic),
  };

  const did = new DID({ resolver });

  ceramic.did = did;

  const seed = randomBytes(32);
  const provider = new Ed25519Provider(seed);
  ceramic.did.setProvider(provider);

  try {
    await ceramic.did.authenticate();
  } catch (error) {
    console.log(error);
  }

  console.log(ceramic.did.id);
})();
