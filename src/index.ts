import {PinoLogger, Logger} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {useEventRecorder, EventRecorder} from './eventRecorder';
import {addTimeout, TimeoutLogger} from './timeout';

import {contextFactory, LambdaContext} from './aws';

type CazooLogger = Logger & TimeoutLogger & FluentContext & EventRecorder;

function logger(base: Logger<LambdaContext>): CazooLogger {
  return useEventRecorder(addTimeout(addFluentContext(base)));
}

export function empty(options = {}): Logger & FluentContext {
  return addFluentContext(PinoLogger(options, {}));
}

export const fromContext = contextFactory(logger);
