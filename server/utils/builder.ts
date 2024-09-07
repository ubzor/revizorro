import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";

// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode
import type PrismaTypes from "@pothos/plugin-prisma/generated";

import { authScopes } from "./authScopes";
import { prisma } from "./prisma";

const builder = new SchemaBuilder<{
  AuthScopes: AuthScopes;
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [ScopeAuthPlugin, ErrorsPlugin, PrismaPlugin, ValidationPlugin],
  authScopes,
  scopeAuthOptions: {
    // Recommended when using subscriptions
    // when this is not set, auth checks are run when event is resolved rather than when the subscription is created
    authorizeOnSubscribe: true,
  },
  errorOptions: {
    defaultTypes: [],
  },
  prisma: {
    client: prisma,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    exposeDescriptions: true,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
    // warn when not using a query parameter correctly
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
  validationOptions: {
    // optionally customize how errors are formatted
    validationError: (zodError, args, context, info) => {
      // the default behavior is to just throw the zod error directly
      return zodError;
    },
  },
});

export { builder };
