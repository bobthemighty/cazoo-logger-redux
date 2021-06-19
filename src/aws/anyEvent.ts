import {
  APIGatewayProxyEvent,
  CloudFrontEvent,
  CloudFrontRequest,
  CloudFrontRequestEvent,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  EventBridgeEvent,
  KinesisStreamEvent,
  KinesisStreamRecord,
  SNSEvent,
  SNSEventRecord,
  SQSEvent,
  SQSRecord,
} from 'aws-lambda';

export type AnyEvent =
  | APIGatewayProxyEvent
  | CloudFrontRequestEvent
  | DynamoDBStreamEvent
  | EventBridgeEvent<string, unknown>
  | KinesisStreamEvent
  | SNSEvent
  | SQSEvent
  | SQSRecord;

type CloudfrontRecord = {
  cf: CloudFrontEvent & {
    request: CloudFrontRequest;
  };
};

export type AnyRecord =
  | CloudfrontRecord
  | DynamoDBRecord
  | KinesisStreamRecord
  | SNSEventRecord
  | SQSRecord;
