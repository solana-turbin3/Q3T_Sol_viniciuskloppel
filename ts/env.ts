import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "./.env") });

interface Env {
  RECIPIENT_WALLET: string;
  MINT_ADDRESS: string;
  // ...
}

const getEnv = (): Partial<Env> => {
  return {
    RECIPIENT_WALLET: process.env.RECIPIENT_WALLET,
    MINT_ADDRESS: process.env.MINT_ADDRESS,
  };
};

const getSanitizedEnv = (env: Partial<Env>): Env => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return env as Env;
};

const _env = getEnv();

const env = getSanitizedEnv(_env);

export default env;
