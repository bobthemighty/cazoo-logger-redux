import {
  APIGatewayProxyEvent,
  SNSEvent,
  CloudFrontRequestEvent,
} from 'aws-lambda';

export type AnyEvent = SNSEvent | APIGatewayProxyEvent | CloudFrontRequestEvent;
