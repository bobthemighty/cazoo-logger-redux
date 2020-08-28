import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { makeContext, LoggerContext } from "./context";
import { LoggerOptions } from "../types";
import hasOwnProperty from "../hasOwnProperty";

function isApiGatewayEvent(event: object): event is APIGatewayProxyEvent {
  return (
    hasOwnProperty(event, "requestContext") &&
    hasOwnProperty(event, "stageVariables")
  );
}

export function forApiGateway(
  event: object,
  context: Context,
  options: Partial<LoggerOptions>
) {
  if (!isApiGatewayEvent(event)) return;
  return makeContext(context, options, {
    http: {
      path: event.path,
      connectionId: event.requestContext.connectionId,
      method: event.httpMethod,
      stage: event.requestContext.stage,
      routeKey: event.requestContext.routeKey,
      query: event.multiValueQueryStringParameters
    }
  });
}
