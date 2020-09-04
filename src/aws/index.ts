import {Context} from 'aws-lambda';
import {Logger, LoggerOptions, PinoLogger, LogExtension} from '../core';
import {forSns} from './sns';
import {forApiGateway} from './apiGateway';
import {forCloudFront} from './cloudfront';
import {LambdaContext} from './context';
import {forEventBridge, EventBridgeContext} from './eventbridge';
import {AnyEvent} from './anyEvent';

const UNKNOWN = 'unknown';

const empty = () => ({
  context: {
    function: {
      name: UNKNOWN,
      service: UNKNOWN,
      version: UNKNOWN,
    },
    request_id: UNKNOWN,
    account_id: UNKNOWN,
  },
});

function fromContext(event: AnyEvent, ctx: Context, options = {}) {
  const context =
    forApiGateway(event, ctx, options) ||
    forEventBridge(event, ctx, options) ||
    forSns(event, ctx, options) ||
    forCloudFront(event, ctx, options) ||
    empty();
  return PinoLogger(options, context);
}

export function contextFactory<
  S extends Logger<SContext>,
  SContext extends Record<string, unknown>
>(
  transform: LogExtension<Logger<LambdaContext>, S, LambdaContext, SContext>
): (event: AnyEvent, ctx: Context, options: Partial<LoggerOptions>) => S {
  return (event: AnyEvent, ctx: Context, options = {}) => {
    return transform(fromContext(event, ctx, options));
  };
}

export {EventBridgeContext, LambdaContext};
