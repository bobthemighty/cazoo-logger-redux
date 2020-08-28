import { PinoLogger, Logger, LoggerOptions, Context } from "./core";
import { addFluentContext, FluentContext } from "./fluentContext";
import { addTimeout, TimeoutLogger } from "./timeout";
import { Context as AwsContext } from "aws-lambda";

import { contextFactory } from "./events";

type CazooLogger = Logger & TimeoutLogger & FluentContext;

function logger(base: Logger): CazooLogger {
  return addTimeout(addFluentContext(base));
}

export function empty(options = {}): CazooLogger {
  return logger(PinoLogger(options));
}


export const fromContext = contextFactory(l => addTimeout(addFluentContext(l)));
