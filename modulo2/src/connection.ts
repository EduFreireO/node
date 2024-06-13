import { Knex, knex as _knex } from "knex";
import { enviroment_variables } from "./env/index";

const { DATABASE_CLIENT, DATABASE_URL, MIGRATE_DIRECTORY } =
  enviroment_variables;

export const databaseConfigurations: Knex.Config = {
  client: DATABASE_CLIENT,
  connection: {
    filename: DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: MIGRATE_DIRECTORY,
  },
};

export const knex = _knex(databaseConfigurations);
