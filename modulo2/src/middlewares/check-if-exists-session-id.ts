import { FastifyRequest, FastifyReply } from "fastify";
import cookies from "@fastify/cookie";
export async function checkIfExistsSessionId(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { session_id } = request.cookies;
  if (!session_id) return response.status(401).send("Invalid session_id");
}
