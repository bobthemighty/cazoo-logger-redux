import {PinoLogger, Logger} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {addTimeout, TimeoutLogger} from './timeout';

import {contextFactory} from './aws';

type CazooLogger = Logger & TimeoutLogger & FluentContext;

function logger(base: Logger): CazooLogger {
  return addTimeout(addFluentContext(base));
}

export function empty(options = {}): CazooLogger {
  return logger(PinoLogger(options));
}

export const fromContext = contextFactory(logger);
