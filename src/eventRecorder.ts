import {EventBridgeEvent} from 'aws-lambda';
import {EventBridgeContext, LambdaContext} from './aws';
import {Logger} from './core';

type Direction = 'IN' | 'OUT';

function write<TLogger extends Logger<LambdaContext>>(
  logger: TLogger,
  type: string,
  id: string,
  dir: Direction
) {
  const ctx = logger.context.context;
  const ts = Date.now();
  logger.output.write(
    `CZEV {"ts": ${ts}, "req": "${ctx.request_id}", "event": {"type": "${type}", "id": "${id}"}, "node": {"name": "${ctx.function.name}", "svc": "${ctx.function.service}"}, "dir": "${dir}" }\n`
  );
}

export interface EventRecorder {
  recordEvent(event: EventBridgeEvent<string, unknown>, dir: Direction): void;
}

function isEventBridge(
  ctx: LambdaContext | LambdaContext<EventBridgeContext>
): ctx is LambdaContext<EventBridgeContext> {
  if (!('trigger' in ctx.context)) return false;
  return ctx.context.trigger === 'EventBridge';
}

export function useEventRecorder<
  TLogger extends Logger<TContext>,
  TContext extends LambdaContext
>(target: TLogger): TLogger & EventRecorder {
  const result = Object.defineProperties(target, {
    recordEvent: {
      value: function (
        this: TLogger,
        event: EventBridgeEvent<string, unknown>,
        dir: Direction
      ) {
        write(this, event['detail-type'], event.id, dir);
      },
      enumerable: true,
    },
  });
  if (isEventBridge(target.context)) {
    const event = target.context.context.event;
    write(target, event.type, event.id, 'IN');
  }

  return result;
}
