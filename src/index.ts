import {PinoLogger, Logger} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {useEventRecorder, EventRecorder} from './eventRecorder';
import {addTimeout, TimeoutLogger} from './timeout';
import {useErrorRecorder, ErrorRecorder} from './errorRecorder';

import {contextFactory, LambdaContext} from './aws';

type CazooLogger = Logger &
  TimeoutLogger &
  FluentContext &
  EventRecorder &
  ErrorRecorder;

function logger(base: Logger<LambdaContext>): CazooLogger {
  return useErrorRecorder(useEventRecorder(addTimeout(addFluentContext(base))));
}

export function empty(options = {}): Logger & FluentContext & ErrorRecorder {
  return useErrorRecorder(addFluentContext(PinoLogger(options, {})));
}

export const fromContext = contextFactory(logger);
