import { writeFileSync } from "node:fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { DateTimeISOResolver } from "graphql-scalars";

import { builder } from "./builder";
import { setErrorsSchema } from "./errors";
import { setUserSchema } from "../resolvers/user";

setErrorsSchema();

setUserSchema();

builder.queryType();
builder.mutationType();
builder.addScalarType("Date", DateTimeISOResolver);

export const schema = builder.toSchema();

// Save GraphQL schema to file
if (process.env.NODE_ENV !== "production") {
  const schemaAsString = printSchema(lexicographicSortSchema(schema));
  writeFileSync("./server/schema.graphql", schemaAsString);
}
