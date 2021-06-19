import {Context, KinesisStreamEvent} from 'aws-lambda';
import {LambdaContext, makeContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent} from './anyEvent';

export function isKinesis(event: AnyEvent): event is KinesisStreamEvent {
  if (!('Records' in event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && 'kinesis' in event.Records[0];
}

export function forKinesis(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isKinesis(event)) return;

  const record = event.Records[0];

  return makeContext(context, options, {
    kinesis: {
      source: record.eventSourceARN,
      id: record.eventID,
    },
  });
}
