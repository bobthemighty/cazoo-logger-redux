import {Context, EventBridgeEvent} from 'aws-lambda';
import {LoggerOptions} from '../core';
import {ContextInfo, LambdaContext, makeContext} from './context';
import {AnyEvent} from './anyEvent';

export function isEventBridge(
  event: AnyEvent
): event is EventBridgeEvent<string, unknown> {
  return 'detail-type' in event;
}

export interface EventDetails {
  source: string;
  type: string;
  id: string;
}

export interface EventBridgeContext extends ContextInfo {
  event: EventDetails;
  trigger: 'EventBridge';
}

export function forEventBridge(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isEventBridge(event)) return;

  return makeContext<EventBridgeContext>(context, options, {
    trigger: 'EventBridge',
    event: {
      source: event.source,
      type: event['detail-type'],
      id: event.id,
    },
  });
}
