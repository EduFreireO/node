import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transaction", (table) => {
    table.uuid("id").primary();
    table.text("title").notNullable();
    table.decimal("amount", 10, 2);
    table.enum("type", ["credit", "debit"]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.uuid("session_id").index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transaction");
}
