import { PinoLogger, Logger, LoggerOptions, Context } from "./core";
import { addFluentContext, FluentContext } from "./fluentContext";
import { addTimeout, TimeoutLogger } from "./timeout";
import { Context as AwsContext } from "aws-lambda";

import { forSns } from "./awsContexts";

type CazooLogger = Logger & TimeoutLogger & FluentContext;

function logger(
  options: Partial<LoggerOptions> = {},
  bindings?: Context
): CazooLogger {
  return addTimeout(addFluentContext(PinoLogger(options, bindings)));
}

export function empty(options = {}): CazooLogger {
  return logger(options);
}

export function fromContext(event: object, ctx: AwsContext, options = {}) {
  const context = forSns(event, ctx, options);
  return context ? logger(options, { context }) : empty(options);
}
