import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { app } from "../app";
import { knex } from "../connection";
import { z } from "zod";
import { checkIfExistsSessionId } from "../middlewares/check-if-exists-session-id";
import { randomUUID } from "crypto";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, response: FastifyReply) => {
    const format = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    let session_id = request.cookies.session_id;
    if (!session_id) {
      session_id = randomUUID();
      response.cookie("session_id", session_id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    const { title, amount, type } = format.parse(request.body);
    const transaction = {
      id: randomUUID(),
      title,
      amount: type == "credit" ? amount : -amount,
      session_id,
    };
    const { id } = transaction;
    const insert = await knex.insert(transaction).into("transaction");
    response.status(201).send({ id });
  });

  app.get(
    "/resume",
    { preHandler: checkIfExistsSessionId },
    async (request: FastifyRequest, response: FastifyReply) => {
      const { session_id } = request.cookies;
      if (!session_id) return response.send("Anauthorized").status(401);
      const { amount } = await knex("transaction")
        .where({ session_id })
        .sum("amount", { as: "amount" })
        .first();
      response.send(amount);
    }
  );

  app.get(
    "/:id",
    { preHandler: checkIfExistsSessionId },
    async (request: FastifyRequest, response: FastifyReply) => {
      const validateParam = z.object({
        id: z.string().uuid(),
      });

      const { session_id } = request.cookies;
      const { id } = validateParam.parse(request.params);
      const transactions = await knex
        .select()
        .from("transaction")
        .where({ id, session_id });
      response.send(transactions);
    }
  );

  app.get(
    "/",
    { preHandler: checkIfExistsSessionId },
    async (request: FastifyRequest, response: FastifyReply) => {
      const { session_id } = request.cookies;
      const transactions = await knex
        .select()
        .from("transaction")
        .where({ session_id });
      response.send(transactions);
    }
  );
}
