import {Context, SNSEvent, SNSMessage, S3Event} from 'aws-lambda';
import {LambdaContext, makeContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent} from './anyEvent';
import has from '../hasOwnProperty';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSNS(event: any): event is SNSEvent {
  if (!has('Records', event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && event.Records[0].EventSource === 'aws:sns';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isS3(msg: any): msg is S3Event {
  if (msg === null) return false;
  if (!has('Records', msg)) return false;
  if (!Array.isArray(msg.Records)) return false;
  return msg.Records.length > 0 && 's3' in msg.Records[0];
}

function s3Data(sns: SNSMessage) {
  if (sns.Subject !== 'Amazon S3 Notification') return;
  const msg = JSON.parse(sns.Message);

  if (!isS3(msg)) return;

  const record = msg.Records[0];
  return {
    bucket: record.s3.bucket.name,
    key: record.s3.object.key,
  };
}

export function forSns(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isSNS(event)) return;

  const sns = event.Records[0].Sns;

  return makeContext(context, options, {
    event: {
      id: sns.MessageId,
      source: sns.TopicArn,
    },
    s3: s3Data(sns),
  });
}
