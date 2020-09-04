import {
  APIGatewayProxyEvent,
  SNSEvent,
  CloudFrontRequestEvent,
  EventBridgeEvent,
} from 'aws-lambda';

export type AnyEvent =
  | SNSEvent
  | APIGatewayProxyEvent
  | CloudFrontRequestEvent
  | EventBridgeEvent<string, unknown>;
