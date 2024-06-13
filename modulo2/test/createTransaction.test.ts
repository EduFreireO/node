import { test, expect, beforeEach, beforeAll, describe } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "child_process";

beforeAll(async () => {
  await app.ready();
});

beforeEach(async () => {
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

describe("User should be able to create a transaction", () => {
  test("should be able to create a transaction", async () => {
    await request(app.server)
      .post("/transaction")
      .send({ type: "credit", amount: 1, title: "X" })
      .expect(201);
  });
});

describe("Should be able to list transactions", () => {
  test("Should be able to list all transactions", async () => {
    const response = await request(app.server)
      .post("/transaction")
      .send({ type: "credit", amount: 1, title: "X" });
    const cookie = response.get("Set-Cookie");

    const transactions = await request(app.server)
      .get("/transaction")
      .set("Cookie", cookie);
    const { body } = transactions;
    expect(body).toEqual([expect.objectContaining({ title: "X", amount: 1 })]);
  });

  test("Should be able to List a specific transaction", async () => {
    const response = await request(app.server)
      .post("/transaction")
      .send({ type: "credit", amount: 1, title: "X" });

    const cookie = response.get("Set-Cookie");
    const requestSpecificTransaction = await request(app.server)
      .get("/transaction/" + response.body.id)
      .set("Cookie", cookie);

    const transaction = requestSpecificTransaction.body[0];

    expect(transaction.id).toBe(response.body.id);
  });
});
