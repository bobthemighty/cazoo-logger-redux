import {baseContext} from './baseContext';
import {KinesisStreamEvent} from 'aws-lambda';

export const context = {
  ...baseContext,
  invokedFunctionArn:
    'arn:aws:lambda:region:account-id:function:function-name:alias-name',
  functionName: 'my-function',
  functionVersion: 'v1.0.1',
  awsRequestId: 'request-id',
  logGroupName: 'log-group',
  logStreamName: 'log-stream',
};

export const event: KinesisStreamEvent = {
  Records: [
    {
      awsRegion: 'eu-west-1',
      kinesis: {
        kinesisSchemaVersion: '1.0',
        partitionKey: '1',
        sequenceNumber:
          '00000000000000000000000000000000000000000000000000000000',
        data: 'Q2F6b28=',
        approximateArrivalTimestamp: 1617973448.987,
      },
      eventID:
        'shardId-000000000000:00000000000000000000000000000000000000000000000000000000',
      eventName: 'aws:kinesis:record',
      eventSource: 'aws:kinesis',
      eventSourceARN:
        'arn:aws:kinesis:eu-west-1:account-id:stream/lambda-stream',
      eventVersion: '1.0',
      invokeIdentityArn: 'arn:aws:iam::account-id:role/lambda-role',
    },
  ],
};
