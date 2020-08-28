import {CloudFrontRequestEvent, Context} from 'aws-lambda';
import {AnyEvent} from './anyEvent';
import {LoggerContext, makeContext} from './context';
import {LoggerOptions} from '../core';

function isCloudFront(event: AnyEvent): event is CloudFrontRequestEvent {
  if (!('Records' in event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && 'cf' in event.Records[0];
}

export function forCloudFront(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LoggerContext | undefined {
  if (!isCloudFront(event)) return;

  const cf = event.Records[0].cf;

  return makeContext(context, options, {
    cf: {
      path: cf.request.uri,
      method: cf.request.method,
      dist: cf.config.distributionId,
      type: cf.config.eventType,
      id: cf.config.requestId,
    },
  });
}
