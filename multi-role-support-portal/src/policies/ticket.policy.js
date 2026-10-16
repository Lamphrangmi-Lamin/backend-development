import { eq, sql } from "drizzle-orm";
import { ticketsTable } from "../db/schema.js";

export const scopeFor = (user) => {
  switch (user.role) {
    case "CUSTOMER":
      return eq(ticketsTable.customerId, user.userId);

    case "AGENT":
      return eq(ticketsTable.assignedAgentId, user.userId);

    case "MANAGER":
      return undefined;

    default:
      return sql`false`;
  }
};
