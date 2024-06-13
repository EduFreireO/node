import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transaction", (table) => {
    table.dropColumn("type");
  });
}

export async function down(knex: Knex): Promise<void> {}
