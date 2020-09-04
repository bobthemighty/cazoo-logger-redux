import {Context, DynamoDBStreamEvent} from 'aws-lambda';
import {LambdaContext, makeContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent} from './anyEvent';

export function isDynamo(event: AnyEvent): event is DynamoDBStreamEvent {
  if (!('Records' in event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && 'dynamodb' in event.Records[0];
}

export function forDynamo(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isDynamo(event)) return;

  const record = event.Records[0];

  return makeContext(context, options, {
    event: {
      id: record.eventID,
      source: record.eventSourceARN,
      type: record.eventName,
    },
  });
}
