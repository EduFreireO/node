import { z } from "zod";
import { config } from "dotenv";
// import "dotenv/config";

const enviroment = process.env.NODE_ENV;

if (enviroment === "test") config({ path: ".env.test" });
else config();

const shape = z.object({
  DATABASE_CLIENT: z.string(),
  DATABASE_URL: z.string(),
  MIGRATE_DIRECTORY: z.string(),
});

export const enviroment_variables = shape.parse(process.env);
