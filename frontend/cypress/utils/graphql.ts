import { CyHttpMessages } from "cypress/types/net-stubbing";

type EnhancedRequest = CyHttpMessages.IncomingHttpRequest & { alias?: string };

// https://fettblog.eu/typescript-hasownproperty/
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export const hasOperationName = (
  req: EnhancedRequest,
  operationName: string
) => {
  const { body } = req;

  return (
    body &&
    hasOwnProperty(body, "operationName") &&
    body.operationName === operationName
  );
};

// Alias query if operationName matches
export const setAliasQuery = (req: EnhancedRequest, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

// Alias mutation if operationName matches
export const setAliasMutation = (
  req: EnhancedRequest,
  operationName: string
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};

export const setAliasAndResponse = (
  req: EnhancedRequest,
  operationName: string,
  type: "Query" | "Mutation",
  body: any
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}${type}`;

    req.reply((res) => {
      res.body = body;
    });
  }
};
