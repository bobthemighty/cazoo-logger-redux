import {Context} from 'aws-lambda';
import {Logger, LoggerOptions, PinoLogger, LogExtension} from '../core';
import {forSns} from './sns';
import {forApiGateway} from './apiGateway';
import {AnyEvent} from './anyEvent';

function fromContext(event: AnyEvent, ctx: Context, options = {}) {
  const context =
    forApiGateway(event, ctx, options) || forSns(event, ctx, options);
  return PinoLogger(options, {context});
}

export function contextFactory<S extends Logger>(
  transform: LogExtension<Logger, S>
): (event: AnyEvent, ctx: Context, options: Partial<LoggerOptions>) => S {
  return (event: AnyEvent, ctx: Context, options = {}) => {
    return transform(fromContext(event, ctx, options));
  };
}
