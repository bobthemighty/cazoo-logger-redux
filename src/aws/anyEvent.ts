import {
  APIGatewayProxyEvent,
  SNSEventRecord,
  SNSEvent,
  CloudFrontRequest,
  CloudFrontEvent,
  CloudFrontRequestEvent,
  EventBridgeEvent,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  SQSEvent,
  SQSRecord,
  KinesisStreamEvent,
  KinesisStreamRecord,
} from 'aws-lambda';

export type AnyEvent =
  | SNSEvent
  | APIGatewayProxyEvent
  | CloudFrontRequestEvent
  | EventBridgeEvent<string, unknown>
  | DynamoDBStreamEvent
  | SQSEvent
  | SQSRecord
  | KinesisStreamEvent;

type CloudfrontRecord = {
  cf: CloudFrontEvent & {
    request: CloudFrontRequest;
  };
};

export type AnyRecord =
  | SNSEventRecord
  | DynamoDBRecord
  | SQSRecord
  | CloudfrontRecord
  | KinesisStreamRecord;
