import { prodKeys } from "./production";
import { devKeys } from "./development";

export interface CONFIG {
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  HOST: string;
}

let keys: CONFIG = {
  DB_NAME: "",
  DB_USERNAME: "",
  DB_PASSWORD: "",
  HOST: ""
};

if (process.env.NODE_ENV === "production") {
  keys = prodKeys;
} else {
  keys = devKeys;
}

export default keys;
