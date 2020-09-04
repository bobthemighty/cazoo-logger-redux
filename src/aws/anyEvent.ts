import {
  APIGatewayProxyEvent,
  SNSEvent,
  CloudFrontRequestEvent,
  EventBridgeEvent,
  DynamoDBStreamEvent,
} from 'aws-lambda';

export type AnyEvent =
  | SNSEvent
  | APIGatewayProxyEvent
  | CloudFrontRequestEvent
  | EventBridgeEvent<string, unknown>
  | DynamoDBStreamEvent;
