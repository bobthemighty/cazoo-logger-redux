import {Context, SQSEvent, SQSRecord} from 'aws-lambda';
import {LambdaContext, makeContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent, AnyRecord} from './anyEvent';

export function isSQSRecord(record: AnyRecord | AnyEvent): record is SQSRecord {
  return 'messageAttributes' in record;
}

function isSQSEvent(event: AnyEvent): event is SQSEvent {
  if (!('Records' in event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && isSQSRecord(event.Records[0]);
}

function ctx(
  record: SQSRecord,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  return makeContext(context, options, {
    sqs: {
      source: record.eventSourceARN,
      id: record.messageId,
    },
  });
}

export function forSqs(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (isSQSEvent(event)) return ctx(event.Records[0], context, options);
  if (isSQSRecord(event)) return ctx(event, context, options);
  return;
}
